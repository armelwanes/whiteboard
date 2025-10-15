import React from 'react';

export const ResizeHandles: React.FC = () => {
  const handles = [
    { position: 'nw', className: 'top-0 left-0 cursor-nw-resize' },
    { position: 'ne', className: 'top-0 right-0 cursor-ne-resize' },
    { position: 'sw', className: 'bottom-0 left-0 cursor-sw-resize' },
    { position: 'se', className: 'bottom-0 right-0 cursor-se-resize' },
  ];

  return (
    <>
      {handles.map(({ position, className }) => (
        <div
          key={position}
          className={`resize-handle absolute w-3 h-3 bg-blue-500 ${className}`}
          data-handle={position}
        />
      ))}
    </>
  );
};
