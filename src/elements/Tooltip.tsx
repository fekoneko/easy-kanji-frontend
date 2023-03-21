import { ReactNode, useEffect, useRef, useState } from 'react';
import { ReactComponent as TooltipPointer } from '../assets/tooltipPointer.svg';

type TooltipProps = {
  shown?: boolean;
  handleClose?: () => any;
  positionWhenDown: { x: number; y: number };
  positionWhenUp: { x: number; y: number };
  width: number;
  children?: ReactNode;
};

const Tooltip = ({
  shown,
  handleClose,
  positionWhenDown,
  positionWhenUp,
  width,
  children,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipDirection, setTooltipDirection] = useState<'up' | 'down'>('down');
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const updateTooltipDirection = () => {
      if (!tooltipRef.current) return;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      if (positionWhenDown.y + tooltipHeight > window.innerHeight) {
        setTooltipDirection('up');
        setCoordinates({ x: positionWhenUp.x - width / 2, y: positionWhenUp.y - tooltipHeight });
      } else {
        setTooltipDirection('down');
        setCoordinates({ x: positionWhenDown.x - width / 2, y: positionWhenDown.y });
      }
    };
    updateTooltipDirection();
  }, [shown]);

  return (
    <>
      {shown ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (handleClose) handleClose();
          }}
          className="tooltipBG"
        >
          <div
            ref={tooltipRef}
            className="tooltip"
            style={{ left: coordinates.x, top: coordinates.y, width }}
          >
            {tooltipDirection === 'down' ? <TooltipPointer className="tooltipPointer" /> : <></>}
            <div className="tooltipContent" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
            {tooltipDirection === 'up' ? (
              <TooltipPointer className="tooltipPointer" style={{ transform: 'rotate(180deg)' }} />
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Tooltip;
