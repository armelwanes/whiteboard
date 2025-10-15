import React from 'react';

interface CanvasDisplayProps {
  sourceCanvasRef: React.RefObject<HTMLCanvasElement>;
  drawCanvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
}

export const CanvasDisplay: React.FC<CanvasDisplayProps> = ({
  sourceCanvasRef,
  drawCanvasRef,
  width,
  height,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-white text-sm mb-2">Source Preview</h3>
        <canvas 
          ref={sourceCanvasRef} 
          width={width} 
          height={height} 
          className="border border-gray-600 bg-white w-full" 
        />
      </div>
      <div>
        <h3 className="text-white text-sm mb-2">Recorded Canvas (video frames)</h3>
        <canvas 
          ref={drawCanvasRef} 
          width={width} 
          height={height} 
          className="border border-gray-600 bg-white w-full" 
        />
      </div>
    </div>
  );
};
