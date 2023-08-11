import { ReactNode, RefObject, useRef, useState } from 'react';
import { ReactComponent as InfoIcon } from '../../assets/infoIcon.svg';
import Tooltip from '../overlays/Tooltip';

type InfoHoverProps = {
  tooltipId?: string;
  tooltipAnchorRef?: RefObject<HTMLElement>;
  caption?: string;
  children?: ReactNode;
};

const Info = ({ tooltipId, tooltipAnchorRef, caption, children }: InfoHoverProps) => {
  const infoIconRef = useRef<HTMLButtonElement>(null);
  const [tooltipShown, setTooltipShown] = useState(false);

  return (
    <>
      <button
        ref={infoIconRef}
        onMouseEnter={() => setTooltipShown(true)}
        onMouseLeave={() => setTooltipShown(false)}
        className={
          caption !== undefined
            ? 'flex items-center gap-1 hover:text-blue [&>svg]:h-4 [&>svg]:w-4'
            : '[&>svg]:h-7 [&>svg]:w-7 hover:[&>svg]:fill-blue'
        }
      >
        {caption && <p>{caption}</p>}
        <InfoIcon />
      </button>
      <Tooltip id={tooltipId} shown={tooltipShown} anchorRef={tooltipAnchorRef ?? infoIconRef}>
        {children}
      </Tooltip>
    </>
  );
};
export default Info;
