import { ReactNode, RefObject, useRef, useState } from 'react';
import { ReactComponent as InfoIcon } from '../../assets/infoIcon.svg';
import Tooltip from './Tooltip';

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
        className="infoHover"
        onMouseEnter={() => setTooltipShown(true)}
        onMouseLeave={() => setTooltipShown(false)}
      >
        {caption && <p>{caption}</p>}
        <InfoIcon />
      </button>
      <Tooltip
        id={tooltipId}
        shown={tooltipShown}
        anchorRef={tooltipAnchorRef ?? infoIconRef}
        className="infoTooltip"
      >
        {children}
      </Tooltip>
    </>
  );
};
export default Info;
