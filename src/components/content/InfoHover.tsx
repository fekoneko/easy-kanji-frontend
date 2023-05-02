import { ReactNode, RefObject, useRef, useState } from 'react';
import { ReactComponent as InfoIcon } from '../../assets/infoIcon.svg';
import Tooltip from './Tooltip';

type InfoHoverProps = {
  tooltipId?: string;
  tooltipAnchorRef?: RefObject<HTMLElement>;
  children?: ReactNode;
};

const InfoHover = ({ tooltipId, tooltipAnchorRef, children }: InfoHoverProps) => {
  const infoIconRef = useRef<HTMLButtonElement>(null);
  const [tooltipShown, setTooltipShown] = useState(false);

  return (
    <>
      <button
        ref={infoIconRef}
        className="hintIcon"
        onMouseEnter={() => setTooltipShown(true)}
        onMouseLeave={() => setTooltipShown(false)}
      >
        <InfoIcon />
      </button>
      <Tooltip id={tooltipId} shown={tooltipShown} anchorRef={tooltipAnchorRef ?? infoIconRef}>
        {children}
      </Tooltip>
    </>
  );
};
export default InfoHover;
