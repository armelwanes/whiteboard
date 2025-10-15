export const resizeAndGetImageData = (img: HTMLImageElement, w: number, h: number): ImageData => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
};

export const toGrayscale = (imageData: ImageData): ImageData => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    d[i] = d[i + 1] = d[i + 2] = gray;
  }
  return imageData;
};

export const applyEdgeDetection = (imageData: ImageData): ImageData => {
  const w = imageData.width;
  const h = imageData.height;
  const d = imageData.data;
  
  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] = d[i * 4];
  }
  
  const edges = new Uint8ClampedArray(w * h);
  
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0;
      let gy = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelValue = gray[(y + ky) * w + (x + kx)];
          gx += pixelValue * sobelX[ky + 1][kx + 1];
          gy += pixelValue * sobelY[ky + 1][kx + 1];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[y * w + x] = Math.min(255, magnitude);
    }
  }
  
  for (let i = 0; i < w * h; i++) {
    const edgeStrength = edges[i] / 255;
    const originalValue = gray[i];
    const enhanced = Math.max(0, originalValue - edgeStrength * 100);
    const idx = i * 4;
    d[idx] = d[idx + 1] = d[idx + 2] = enhanced;
  }
  
  return imageData;
};

export const adaptiveThresholdApprox = (imageData: ImageData, blockSize: number = 15, C: number = 10): ImageData => {
  const w = imageData.width;
  const h = imageData.height;
  const d = imageData.data;

  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] = d[i * 4];
  }

  const radius = Math.floor(blockSize / 2);
  const output = new Uint8ClampedArray(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      const x1 = Math.max(0, x - radius);
      const x2 = Math.min(w - 1, x + radius);
      const y1 = Math.max(0, y - radius);
      const y2 = Math.min(h - 1, y + radius);

      for (let yy = y1; yy <= y2; yy++) {
        for (let xx = x1; xx <= x2; xx++) {
          sum += gray[yy * w + xx];
          count++;
        }
      }

      const meanVal = count > 0 ? sum / count : 0;
      const pixelVal = gray[y * w + x];
      output[y * w + x] = pixelVal > meanVal - C ? 255 : 0;
    }
  }

  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    d[idx] = d[idx + 1] = d[idx + 2] = output[i];
  }

  return imageData;
};

export const preprocessHand = (handImg: HTMLImageElement, handMask: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  const w = handImg.width;
  const h = handImg.height;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(handImg, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const maskCtx = maskCanvas.getContext("2d");
  if (!maskCtx) throw new Error("Could not get mask context");

  maskCtx.drawImage(handMask, 0, 0, w, h);
  const maskData = maskCtx.getImageData(0, 0, w, h);

  const d = imgData.data;
  const m = maskData.data;

  for (let i = 0; i < d.length; i += 4) {
    const maskVal = m[i];
    d[i + 3] = maskVal > 128 ? d[i + 3] : 0;
  }

  ctx.putImageData(imgData, 0, 0);
  return { canvas, width: w, height: h };
};

export const findBlackPixelsWithStrokes = (imageData: ImageData, strokeSpeed: number) => {
  const w = imageData.width;
  const h = imageData.height;
  const d = imageData.data;

  const visited = new Uint8Array(w * h);
  const strokes: Array<{ x: number; y: number }[]> = [];

  const isBlack = (x: number, y: number) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return false;
    const idx = (y * w + x) * 4;
    return d[idx] < 128;
  };

  const floodFillStroke = (startX: number, startY: number) => {
    const stroke: { x: number; y: number }[] = [];
    const queue: { x: number; y: number }[] = [{ x: startX, y: startY }];

    while (queue.length > 0) {
      const { x, y } = queue.shift()!;
      const idx = y * w + x;

      if (visited[idx] || !isBlack(x, y)) continue;

      visited[idx] = 1;
      stroke.push({ x, y });

      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
        { x: x + 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x - 1, y: y + 1 },
      ];

      for (const n of neighbors) {
        if (n.x >= 0 && n.x < w && n.y >= 0 && n.y < h) {
          queue.push(n);
        }
      }
    }

    return stroke;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!visited[idx] && isBlack(x, y)) {
        const stroke = floodFillStroke(x, y);
        if (stroke.length > 0) {
          strokes.push(stroke);
        }
      }
    }
  }

  const allTiles: { x: number; y: number }[] = [];
  for (const stroke of strokes) {
    for (let i = 0; i < stroke.length; i += strokeSpeed) {
      allTiles.push(stroke[i]);
    }
    if (stroke.length > 0 && !allTiles.includes(stroke[stroke.length - 1])) {
      allTiles.push(stroke[stroke.length - 1]);
    }
  }

  return allTiles;
};
