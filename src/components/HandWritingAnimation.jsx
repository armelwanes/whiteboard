import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Upload, Play, Download } from "lucide-react";

/**
 * HandWritingFromPython.jsx
 * Transcription du script Python -> logique équivalente en JS (browser)
 *
 * Fonctionnalités:
 * - Upload image
 * - Prétraitement : resize, grayscale, seuillage (approx adaptatif)
 * - Prétraitement main : découpe par mask
 * - Découpage en grille, selection de cellules avec pixels noirs
 * - Dessin progressif en suivant cellule la plus proche
 * - Enregistrement vidéo via MediaRecorder depuis le canvas
 */

const HandWritingAnimation = () => {
  const sourceCanvasRef = useRef(null); // preview source
  const drawCanvasRef = useRef(null); // drawing canvas (recorded)
  const handCanvasRef = useRef(null); // temporary for processed hand
  const mediaRecorderRef = useRef(null);
  const recordedBlobsRef = useRef([]);

  const [sourceImage, setSourceImage] = useState(null);
  const [handImage, setHandImage] = useState(null);
  const [handMask, setHandMask] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);

  // default variables mirroring AllVariables in python
  const variablesDefault = {
    frameRate: 30,
    resizeWd: 640,
    resizeHt: 360,
    splitLen: 10,
    objectSkipRate: 5,
    bgObjectSkipRate: 20,
    endGrayImgDurationInSec: 2,
  };

  // load hand images from public/data/images on mount
  useEffect(() => {
    const hand = new Image();
    hand.src = "/data/images/drawing-hand.png";
    hand.onload = () => setHandImage(hand);

    const mask = new Image();
    mask.src = "/data/images/hand-mask.png";
    mask.onload = () => setHandMask(mask);
  }, []);

  /* -----------------------------
     Utility functions (browser)
     ----------------------------- */

  const eucDistArr = (arr, point) => {
    // arr: [[x,y], ...], point: [x,y]
    return arr.map((p) => {
      const dx = p[0] - point[0];
      const dy = p[1] - point[1];
      return Math.sqrt(dx * dx + dy * dy);
    });
  };

  // resize image to target dims and return ImageData
  const resizeAndGetImageData = (img, w, h) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  };

  // convert ImageData to grayscale in place
  const toGrayscale = (imageData) => {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i],
        g = d[i + 1],
        b = d[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      d[i] = d[i + 1] = d[i + 2] = gray;
    }
    return imageData;
  };

  // simple global threshold (used after adaptive approximation)
  const applyThreshold = (imageData, thresh = 128) => {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = d[i];
      const t = v < thresh ? 0 : 255;
      d[i] = d[i + 1] = d[i + 2] = t;
    }
    return imageData;
  };

  // approximate adaptive threshold by dividing image into tiles and thresholding locally
  const adaptiveThresholdApprox = (imageData, tileSize = 15, offset = 10) => {
    // imageData will be modified in place
    const w = imageData.width;
    const h = imageData.height;
    const d = imageData.data;
    // compute integral image (sum of grayscale) to quickly compute local mean
    // but for simplicity iterate tiles
    for (let ty = 0; ty < h; ty += tileSize) {
      for (let tx = 0; tx < w; tx += tileSize) {
        // compute mean in tile
        let sum = 0,
          count = 0;
        for (let y = ty; y < Math.min(h, ty + tileSize); y++) {
          for (let x = tx; x < Math.min(w, tx + tileSize); x++) {
            const idx = (y * w + x) * 4;
            sum += d[idx];
            count++;
          }
        }
        const mean = count ? sum / count : 128;
        const thresh = mean - offset;
        for (let y = ty; y < Math.min(h, ty + tileSize); y++) {
          for (let x = tx; x < Math.min(w, tx + tileSize); x++) {
            const idx = (y * w + x) * 4;
            const v = d[idx];
            const t = v < thresh ? 0 : 255;
            d[idx] = d[idx + 1] = d[idx + 2] = t;
          }
        }
      }
    }
    return imageData;
  };

  // given grayscale binary imageData, check if block has any black pixels
  const blockHasBlack = (imageData, startX, startY, blockSize) => {
    const w = imageData.width;
    const h = imageData.height;
    const d = imageData.data;
    for (let y = startY; y < Math.min(h, startY + blockSize); y++) {
      for (let x = startX; x < Math.min(w, startX + blockSize); x++) {
        const idx = (y * w + x) * 4;
        if (d[idx] < 10) return true;
      }
    }
    return false;
  };

  // get extreme coordinates from a mask image (mask: HTMLImageElement loaded grayscale or RGBA)
  const getExtremeCoordinatesFromMask = (maskImage) => {
    // draw mask on temp canvas and find bounding box of white (255) pixels
    const canvas = document.createElement("canvas");
    canvas.width = maskImage.width;
    canvas.height = maskImage.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(maskImage, 0, 0);
    const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgd.data;
    const w = canvas.width;
    const h = canvas.height;
    let minX = w,
      minY = h,
      maxX = 0,
      maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        // assume white mask pixels where alpha or value > 128
        const v = d[idx]; // grayscale expected
        if (v > 128) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (minX > maxX || minY > maxY) return null;
    return { minX, minY, maxX, maxY };
  };

  // preprocess hand: crop according to mask and create hand canvas & mask arrays
  const preprocessHand = async (handImg, handMaskImg) => {
    if (!handImg || !handMaskImg) return null;
    const bounds = getExtremeCoordinatesFromMask(handMaskImg);
    if (!bounds) return null;
    const w = bounds.maxX - bounds.minX + 1;
    const h = bounds.maxY - bounds.minY + 1;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(handImg, bounds.minX, bounds.minY, w, h, 0, 0, w, h);

    // process mask into binary array and inverse mask float array
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mc = maskCanvas.getContext("2d");
    mc.drawImage(handMaskImg, bounds.minX, bounds.minY, w, h, 0, 0, w, h);
    const maskData = mc.getImageData(0, 0, w, h).data;
    const maskArr = new Uint8ClampedArray(w * h);
    const maskInvArr = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const v = maskData[i * 4]; // grayscale assumed
      maskArr[i] = v > 128 ? 1 : 0;
      maskInvArr[i] = v > 128 ? 0 : 1; // inverse (1 where background)
    }

    return {
      canvas,
      width: w,
      height: h,
      maskArr,
      maskInvArr,
    };
  };

  /* -----------------------------
     Core drawing & generation logic (équivalent Python)
     ----------------------------- */

  // draws a cropped hand onto an RGB imageData buffer (Uint8ClampedArray) - modifies destImageData in place
  const drawHandOnImageData = (
    destImageData,
    handProc,
    handX,
    handY,
    destW,
    destH
  ) => {
    if (!handProc) return;
    const { canvas: handCanvas, width: handW, height: handH, maskArr } = handProc;
    const destD = destImageData.data;
    const w = destW;
    const h = destH;

    const cropW = Math.min(handW, w - handX);
    const cropH = Math.min(handH, h - handY);
    if (cropW <= 0 || cropH <= 0) return;

    // get hand pixels
    const hc = handCanvas.getContext("2d");
    const handImgData = hc.getImageData(0, 0, cropW, cropH).data;

    for (let ry = 0; ry < cropH; ry++) {
      for (let rx = 0; rx < cropW; rx++) {
        const hi = (ry * handW + rx); // mask index uses original handW
        const maskVal = maskArr[hi]; // 1 where hand (foreground)
        const destX = handX + rx;
        const destY = handY + ry;
        const di = (destY * w + destX) * 4;
        const hiPix = (ry * cropW + rx) * 4;
        // blending: if maskVal==1, overwrite by hand pixel, else leave dest
        if (maskVal === 1) {
          destD[di] = handImgData[hiPix];
          destD[di + 1] = handImgData[hiPix + 1];
          destD[di + 2] = handImgData[hiPix + 2];
          destD[di + 3] = 255;
        }
      }
    }
  };

  // main function that mimics draw_masked_object + draw_whiteboard_animations
  const generateVideoFromImage = async (img, variables, handProc, recordCallback) => {
    const w = variables.resizeWd;
    const h = variables.resizeHt;

    // 1) preprocess: resize + grayscale + adaptive threshold approx
    let imageData = resizeAndGetImageData(img, w, h);
    imageData = toGrayscale(imageData);
    imageData = adaptiveThresholdApprox(imageData, 15, 10); // approx adaptive
    // keep a color-resized full image for final frames
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = w;
    colorCanvas.height = h;
    colorCanvas.getContext("2d").drawImage(img, 0, 0, w, h);
    const colorImageData = colorCanvas.getContext("2d").getImageData(0, 0, w, h);

    // 2) grid split & find black cells
    const splitLen = variables.splitLen;
    const nCutsVertical = Math.ceil(h / splitLen);
    const nCutsHorizontal = Math.ceil(w / splitLen);
    const cells = []; // stores {x:col, y:row}
    for (let row = 0; row < nCutsVertical; row++) {
      for (let col = 0; col < nCutsHorizontal; col++) {
        const sx = col * splitLen;
        const sy = row * splitLen;
        if (blockHasBlack(imageData, sx, sy, splitLen)) {
          cells.push([col, row]);
        }
      }
    }

    // create drawn_frame (initially white)
    const drawnCanvas = document.createElement("canvas");
    drawnCanvas.width = w;
    drawnCanvas.height = h;
    const drawnCtx = drawnCanvas.getContext("2d");
    drawnCtx.fillStyle = "white";
    drawnCtx.fillRect(0, 0, w, h);

    // convert drawnCanvas to ImageData for pixel-level ops
    let drawnImageData = drawnCtx.getImageData(0, 0, w, h);

    // prepare media recorder to record drawCanvasRef stream
    const recordCanvas = drawCanvasRef.current;
    recordCanvas.width = w;
    recordCanvas.height = h;
    const recordCtx = recordCanvas.getContext("2d");
    // initial blank
    recordCtx.fillStyle = "white";
    recordCtx.fillRect(0, 0, w, h);

    recordedBlobsRef.current = [];
    setVideoUrl(null);

    const stream = recordCanvas.captureStream(variables.frameRate);
    const options = { mimeType: "video/webm;codecs=vp9" };
    let mediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      // fallback codec
      mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
    }
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) recordedBlobsRef.current.push(ev.data);
    };

    mediaRecorder.start();

    // algorithm similar to Python: pick nearest cell each iteration
    let currentCell = [0, 0];
    let counter = 0;
    let cellsArr = cells.slice(); // copy
    // safety: if too many cells, limit to avoid blocking forever
    const maxIterations = cellsArr.length * 2 + 1000;

    // helper to draw grid cell from imageData to drawnImageData
    const drawCellToDrawn = (col, row) => {
      const sx = col * splitLen;
      const sy = row * splitLen;
      const cellW = Math.min(splitLen, w - sx);
      const cellH = Math.min(splitLen, h - sy);
      const src = imageData.data;
      const dest = drawnImageData.data;
      for (let yy = 0; yy < cellH; yy++) {
        for (let xx = 0; xx < cellW; xx++) {
          const sxp = sx + xx;
          const syp = sy + yy;
          const si = (syp * w + sxp) * 4;
          const di = si;
          // copy R G B from binary image (0 or 255)
          dest[di] = src[si];
          dest[di + 1] = src[si + 1];
          dest[di + 2] = src[si + 2];
          dest[di + 3] = 255;
        }
      }
    };

    // loop - we'll use async loop with small delays to allow UI updates
    let iter = 0;
    while (cellsArr.length > 0 && iter < maxIterations) {
      iter++;
      // pick nearest cell to currentCell
      const dists = eucDistArr(cellsArr.map((c) => [c[0], c[1]]), currentCell);
      let minIdx = 0;
      let minVal = dists[0] ?? Infinity;
      for (let i = 1; i < dists.length; i++) {
        if (dists[i] < minVal) {
          minVal = dists[i];
          minIdx = i;
        }
      }
      const sel = cellsArr[minIdx];
      // draw selection onto drawnImageData
      drawCellToDrawn(sel[0], sel[1]);

      // compute hand position (center of cell in pixels)
      const cellStartX = sel[0] * splitLen;
      const cellStartY = sel[1] * splitLen;
      const handX = cellStartX + Math.floor(splitLen / 2);
      const handY = cellStartY + Math.floor(splitLen / 2);

      // create a temp canvas to compose drawnImageData + hand
      drawnCtx.putImageData(drawnImageData, 0, 0);
      // draw hand overlay onto drawnCtx (we use handProc which has a canvas and mask)
      if (handProc) {
        // draw handProc.canvas at (handX, handY) with clipping to canvas size
        const hw = handProc.width;
        const hh = handProc.height;
        const dx = handX;
        const dy = handY;
        drawnCtx.drawImage(handProc.canvas, 0, 0, Math.min(hw, w - dx), Math.min(hh, h - dy), dx, dy, Math.min(hw, w - dx), Math.min(hh, h - dy));
      }

      // copy composed drawnCtx to recordCanvas for MediaRecorder
      recordCtx.clearRect(0, 0, w, h);
      recordCtx.drawImage(drawnCanvas, 0, 0);

      counter++;
      // write frame to video stream occasionally according to skip_rate (objectSkipRate)
      if (counter % variables.objectSkipRate === 0) {
        // let media recorder capture via captureStream; frames are captured automatically at frameRate.
        // But to ensure capturing intermediate frames, we can draw to canvas repeatedly and wait small time.
        // Here we just wait for next animation frame (gives MediaRecorder time to sample)
        await new Promise((r) => setTimeout(r, Math.max(0, 1000 / variables.frameRate)));
      }

      // remove selected cell from list
      cellsArr.splice(minIdx, 1);
      currentCell = sel;
      // update progress
      const drawnCount = iter;
      const totalCount = cells.length || 1;
      setProgress(Math.floor((drawnCount / totalCount) * 100));
    }

    // draw final color image for a few seconds to match python behaviour
    const showFinalFrames = variables.frameRate * variables.endGrayImgDurationInSec;
    for (let i = 0; i < showFinalFrames; i++) {
      recordCtx.clearRect(0, 0, w, h);
      recordCtx.putImageData(colorImageData, 0, 0);
      await new Promise((r) => setTimeout(r, Math.max(0, 1000 / variables.frameRate)));
    }

    // stop recorder and produce blob URL
    await new Promise((res) => {
      mediaRecorder.onstop = () => res();
      mediaRecorder.stop();
    });

    const superBuffer = new Blob(recordedBlobsRef.current, { type: "video/webm" });
    const url = window.URL.createObjectURL(superBuffer);
    setVideoUrl(url);

    if (recordCallback) recordCallback(url);
    setIsGenerating(false);
    setProgress(100);
  };

  /* -----------------------------
     Handlers & UI
     ----------------------------- */

  const handleSourceUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setSourceImage(img);
      // draw preview
      const ctx = sourceCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, sourceCanvasRef.current.width, sourceCanvasRef.current.height);
      // fit image into preview canvas
      const scale = Math.min(sourceCanvasRef.current.width / img.width, sourceCanvasRef.current.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, sourceCanvasRef.current.width, sourceCanvasRef.current.height);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleStart = async () => {
    if (!sourceImage) {
      alert("Upload an image first");
      return;
    }
    setIsGenerating(true);
    setProgress(0);
    setVideoUrl(null);

    // determine target resolution similar to python find_nearest_res heuristics
    const vars = { ...variablesDefault };

    // attempt to keep aspect ratio and use default resize (we keep defaults)
    // preprocess hand
    const handProc = await preprocessHand(handImage, handMask);

    await generateVideoFromImage(sourceImage, vars, handProc, (url) => {
      console.log("video ready", url);
    });
  };

  const handleDownload = () => {
    if (!videoUrl) {
      alert("Génère la vidéo d'abord");
      return;
    }
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "handwriting.webm";
    a.click();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Handwriting (Python → Browser)</CardTitle>
          <p className="text-gray-400 text-sm">
            Conversion du script Python en React/browser - génère une vidéo WebM
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={() => document.getElementById("src-upload").click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </Button>
            <input id="src-upload" onChange={handleSourceUpload} className="hidden" type="file" accept="image/*" />
            <Button onClick={handleStart} disabled={!sourceImage || isGenerating} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {isGenerating ? "Génération..." : "Start"}
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={!videoUrl} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          {isGenerating && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <p className="text-xs text-gray-400">Progress: {progress}%</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-white text-sm mb-2">Source Preview</h3>
              <canvas ref={sourceCanvasRef} width={variablesDefault.resizeWd} height={variablesDefault.resizeHt} className="border border-gray-600 bg-white w-full" />
            </div>
            <div>
              <h3 className="text-white text-sm mb-2">Recorded Canvas (video frames)</h3>
              <canvas ref={drawCanvasRef} width={variablesDefault.resizeWd} height={variablesDefault.resizeHt} className="border border-gray-600 bg-white w-full" />
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>Hand Image: {handImage ? "✓ Loaded" : "⏳ Loading..."}</p>
            <p>Hand Mask: {handMask ? "✓ Loaded" : "⏳ Loading..."}</p>
            {videoUrl && (
              <p className="mt-2">
                Vidéo générée : <a href={videoUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">Voir</a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandWritingAnimation;
