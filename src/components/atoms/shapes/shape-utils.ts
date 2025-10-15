export interface ShapeCommonProps {
  ref: any;
  draggable: boolean;
  onClick: () => void;
  onTap: () => void;
  opacity: number;
  onDragEnd: (e: any) => void;
  onTransformEnd: () => void;
}

export const getFillStrokeProps = (config: any) => {
  const fillMode = config.fillMode || 'both';
  const props: any = {};
  
  if (fillMode === 'fill' || fillMode === 'both') {
    props.fill = config.fill;
  }
  
  if (fillMode === 'stroke' || fillMode === 'both') {
    props.stroke = config.stroke;
    props.strokeWidth = config.strokeWidth;
  }
  
  return props;
};
