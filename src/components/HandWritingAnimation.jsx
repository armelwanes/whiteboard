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
 * - Découpage en grille, selection de cellules avec pixels noirs -> REMPLACÉ PAR SUIVI DE STROKES
 * - Dessin progressif en suivant cellule la plus proche -> REMPLACÉ PAR TRACÉ DE STROKES
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
    // splitLen: 10, // Plus utilisé pour le tracé de strokes
    strokeTraceSpeed: 3, // Nombre de pixels tracés par "étape" d'animation
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

  // Supprimé: eucDistArr, blockHasBlack (plus pertinent pour la logique de cellules)
  // applyThreshold (plus pertinent car on utilise adaptiveThresholdApprox)

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

  // approximate adaptive threshold by dividing image into tiles and thresholding locally
  const adaptiveThresholdApprox = (imageData, tileSize = 15, offset = 10) => {
    // imageData will be modified in place
    const w = imageData.width;
    const h = imageData.height;
    const d = imageData.data;
    for (let ty = 0; ty < h; ty += tileSize) {
      for (let tx = 0; tx < w; tx += tileSize) {
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

  // get extreme coordinates from a mask image
  const getExtremeCoordinatesFromMask = (maskImage) => {
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
        const v = d[idx];
        if (v > 128) { // Assuming white pixels indicate the mask
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

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mc = maskCanvas.getContext("2d");
    mc.drawImage(handMaskImg, bounds.minX, bounds.minY, w, h, 0, 0, w, h);
    const maskData = mc.getImageData(0, 0, w, h).data;
    const maskArr = new Uint8ClampedArray(w * h);
    // const maskInvArr = new Float32Array(w * h); // Not used anymore, simpler mask
    for (let i = 0; i < w * h; i++) {
      const v = maskData[i * 4];
      maskArr[i] = v > 128 ? 1 : 0; // 1 where hand (foreground), 0 where transparent (background)
    }

    return {
      canvas,
      width: w,
      height: h,
      maskArr,
    };
  };

  /* -----------------------------
     Stroke detection and ordering logic
     ----------------------------- */

  // Fonction pour trouver et ordonner les strokes (chemins de pixels)
  const findAndOrderStrokes = (imageData, w, h) => {
    const d = imageData.data;
    const visited = new Uint8ClampedArray(w * h).fill(0); // 0: non visité, 1: visité
    const strokes = [];
    const blackColor = 0; // Seuil bas pour les pixels noirs (0-255)

    // Directions pour les 8 voisins (y, x)
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    // Simple fonction pour vérifier si un pixel est noir et non visité
    const isBlackAndUnvisited = (x, y) => {
      if (x < 0 || x >= w || y < 0 || y >= h) return false;
      const idx = (y * w + x) * 4;
      return d[idx] < 10 && visited[y * w + x] === 0; // d[idx] est la valeur de gris
    };

    // Parcours en profondeur (DFS) pour trouver un stroke
    const dfs = (startX, startY) => {
      const currentStroke = [];
      const stack = [[startX, startY]];
      let lastPoint = [startX, startY];

      while (stack.length > 0) {
        const [cx, cy] = stack.pop(); // On prend le dernier ajouté
        const flatIdx = cy * w + cx;

        if (visited[flatIdx] === 1) continue;
        visited[flatIdx] = 1;
        currentStroke.push([cx, cy]);
        lastPoint = [cx, cy]; // Mettre à jour le dernier point ajouté au stroke

        // Chercher les voisins noirs et non visités, en favorisant la continuité
        let nextPointFound = false;
        // Prioriser les voisins adjacents à lastPoint pour un tracé plus continu
        // Nous allons regarder autour du point que nous venons d'ajouter
        const neighbors = [];
        for (const [dy, dx] of directions) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (isBlackAndUnvisited(nx, ny)) {
            neighbors.push([nx, ny]);
          }
        }

        // Pour un tracé plus "continu", trier les voisins par distance à la "direction précédente"
        // Ou simplement ajouter les voisins et laisser le stack gérer
        // Ici, on les ajoute simplement. La qualité du tracé dépendra de l'ordre d'ajout.
        // On pourrait affiner en choisissant le voisin qui continue le mieux la "direction"
        for(const neighbor of neighbors) {
          stack.push(neighbor);
        }
      }
      return currentStroke;
    };


    // Chercher tous les strokes
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (d[idx] < 10 && visited[y * w + x] === 0) { // Si pixel noir et non visité
          const newStroke = dfs(x, y);
          if (newStroke.length > 1) { // Un stroke doit avoir au moins 2 points
            strokes.push(newStroke);
          }
        }
      }
    }

    // Ici, nous pourrions ajouter une étape pour "ordonner" les strokes
    // par exemple, du haut vers le bas, ou de gauche à droite,
    // pour simuler un ordre d'écriture plus naturel.
    // Pour l'instant, ils sont dans l'ordre de découverte.
    // Un simple tri par le point de départ peut suffire pour commencer.
    strokes.sort((a, b) => {
      const [ax, ay] = a[0];
      const [bx, by] = b[0];
      if (ay !== by) return ay - by;
      return ax - bx;
    });

    return strokes;
  };

  /* -----------------------------
     Core drawing & generation logic (équivalent Python)
     ----------------------------- */

  const generateVideoFromImage = async (img, variables, handProc, recordCallback) => {
    const w = variables.resizeWd;
    const h = variables.resizeHt;

    // 1) preprocess: resize + grayscale + adaptive threshold approx
    let imageData = resizeAndGetImageData(img, w, h);
    imageData = toGrayscale(imageData);
    imageData = adaptiveThresholdApprox(imageData, 15, 10); // approx adaptive

    // 2) Find and order strokes
    const strokes = findAndOrderStrokes(imageData, w, h);
    console.log(`Found ${strokes.length} strokes.`);

    // Keep a color-resized full image for final frames
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = w;
    colorCanvas.height = h;
    colorCanvas.getContext("2d").drawImage(img, 0, 0, w, h);
    const colorImageData = colorCanvas.getContext("2d").getImageData(0, 0, w, h);

    // Create drawn_frame (initially white)
    const drawnCanvas = document.createElement("canvas");
    drawnCanvas.width = w;
    drawnCanvas.height = h;
    const drawnCtx = drawnCanvas.getContext("2d");
    drawnCtx.fillStyle = "white";
    drawnCtx.fillRect(0, 0, w, h);

    // Prepare media recorder to record drawCanvasRef stream
    const recordCanvas = drawCanvasRef.current;
    recordCanvas.width = w;
    recordCanvas.height = h;
    const recordCtx = recordCanvas.getContext("2d");
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
      mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
    }
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) recordedBlobsRef.current.push(ev.data);
    };

    mediaRecorder.start();

    let currentPointIndex = 0;
    let currentStrokeIndex = 0;
    const totalPoints = strokes.flat().length; // Nombre total de pixels à dessiner
    let drawnPointsCount = 0;

    // Loop through strokes and points
    while (currentStrokeIndex < strokes.length) {
      const currentStroke = strokes[currentStrokeIndex];
      const traceSpeed = variables.strokeTraceSpeed; // Pixels tracés par "frame" ou étape

      for (let i = 0; i < traceSpeed; i++) {
        if (currentPointIndex >= currentStroke.length) {
          break; // Fin du stroke actuel
        }
        const [px, py] = currentStroke[currentPointIndex];

        // Draw the pixel on drawnCtx
        drawnCtx.fillStyle = "black"; // Tracer en noir
        drawnCtx.fillRect(px, py, 1, 1); // Dessine un pixel

        // Update hand position
        const handX = px;
        const handY = py;

        // Compose drawnCtx + hand on recordCanvas
        recordCtx.clearRect(0, 0, w, h); // Clear previous frame
        recordCtx.drawImage(drawnCanvas, 0, 0); // Draw what's been drawn so far

        // Draw hand overlay
        if (handProc) {
          const hw = handProc.width;
          const hh = handProc.height;
          // Ajuster la position de la main pour que la pointe du stylo soit sur (handX, handY)
          // Ceci nécessitera un ajustement précis basé sur la forme de la main/stylo
          // Pour l'instant, plaçons le centre du bas de la main sur le point
          // Cela pourrait être amélioré si la position de la pointe du stylo est connue dans l'image de la main
          const handDrawX = handX - handProc.width / 2; // Exemple: centrer la main sur le point
          const handDrawY = handY - handProc.height; // Exemple: positionner le bas de la main sur le point

          recordCtx.drawImage(
            handProc.canvas,
            Math.max(0, -handDrawX), Math.max(0, -handDrawY), // Source clipping
            Math.min(hw, w - handDrawX, handDrawX + hw), Math.min(hh, h - handDrawY, handDrawY + hh), // Source clipping width/height
            handDrawX, handDrawY, // Destination X, Y
            Math.min(hw, w - handDrawX), Math.min(hh, h - handDrawY) // Destination W, H
          );
        }

        drawnPointsCount++;
        currentPointIndex++;
      }

      // If current stroke is finished, move to the next
      if (currentPointIndex >= currentStroke.length) {
        currentStrokeIndex++;
        currentPointIndex = 0; // Reset point index for next stroke
      }

      // Update progress
      setProgress(Math.floor((drawnPointsCount / totalPoints) * 100));

      // Wait for next animation frame
      await new Promise((r) => setTimeout(r, Math.max(0, 1000 / variables.frameRate)));
    }

    // Final frame: remove hand, show full drawing
    recordCtx.clearRect(0, 0, w, h);
    recordCtx.drawImage(drawnCanvas, 0, 0);
    await new Promise((r) => setTimeout(r, Math.max(0, 1000 / variables.frameRate)));


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
      const ctx = sourceCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, sourceCanvasRef.current.width, sourceCanvasRef.current.height);
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

    const vars = { ...variablesDefault };
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