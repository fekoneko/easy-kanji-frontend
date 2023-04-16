import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as TooltipPointer } from '../assets/tooltipPointer.svg';
import useOnClick from '../../hooks/useOnClick';

type TooltipProps<T extends HTMLElement = HTMLElement> = {
  anchorRef: RefObject<T>;
  shown?: boolean;
  handleClose?: () => any;
  className?: string;
  id?: string;
  children?: ReactNode;
};

const Tooltip = ({ anchorRef, shown, handleClose, className, id, children }: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipDirection, setTooltipDirection] = useState<'up' | 'down'>('down');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipWidth, setTooltipWidth] = useState<number>(0);

  useEffect(() => {
    const updateTooltipDirection = () => {
      if (!tooltipRef.current || !anchorRef.current) return;
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;

      setTooltipWidth(anchorRect.width);
      if (anchorRect.bottom + tooltipHeight > window.innerHeight) {
        setTooltipDirection('up');
        setTooltipPosition({
          x: anchorRect.left,
          y: anchorRect.top - tooltipHeight,
        });
      } else {
        setTooltipDirection('down');
        setTooltipPosition({
          x: anchorRect.left,
          y: anchorRect.bottom,
        });
      }
    };
    updateTooltipDirection();
  }, [shown, anchorRef, tooltipRef, tooltipRef.current?.offsetHeight]);

  useOnClick(
    tooltipRef,
    () => {
      if (handleClose) handleClose();
    },
    'outside'
  );

  return (
    <CSSTransition in={shown} unmountOnExit timeout={200} classNames="tooltip" nodeRef={tooltipRef}>
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{ left: tooltipPosition.x, top: tooltipPosition.y, width: tooltipWidth }}
      >
        {tooltipDirection === 'down' ? <TooltipPointer className="tooltipPointer" /> : <></>}
        <div className={`tooltipContent${className ? ` ${className}` : ''}`} id={id}>
          {children}
        </div>
        {tooltipDirection === 'up' ? (
          <TooltipPointer className="tooltipPointer" style={{ transform: 'rotate(180deg)' }} />
        ) : (
          <></>
        )}
      </div>
    </CSSTransition>
  );
};
export default Tooltip;
