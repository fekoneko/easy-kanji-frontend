import { ReactNode, useRef, useState } from 'react';
import useOnClick from '../../hooks/useOnClick';
import { ReactComponent as OpenMenuIcon } from '../../assets/menu.svg';
import { ReactComponent as CloseMenuIcon } from '../../assets/close.svg';

type DropDownMenuProps = {
  title?: string;
  expandedTitle?: string;
  className?: string;
  children?: ReactNode;
};

const DropDownMenu = ({ title, expandedTitle, className, children }: DropDownMenuProps) => {
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const wraperRef = useRef<HTMLDivElement>(null);

  useOnClick(wraperRef, () => setExpanded(false), 'outside');

  const toggleMenu = () => setExpanded((prev) => !prev);

  return (
    <div ref={wraperRef} className="flex flex-col">
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-center gap-2 rounded-b-sm p-1 text-lg hover:bg-black hover:bg-opacity-20 dark:hover:bg-white dark:hover:bg-opacity-10 [&>svg]:h-5 [&>svg]:w-5 ${
          expanded ? 'text-white [background:theme("colors.primary")!important]' : ''
        }`}
      >
        {expanded ? (
          <>
            <p>{expandedTitle ?? title}</p>
            <CloseMenuIcon />
          </>
        ) : (
          <>
            <p>{title}</p>
            <OpenMenuIcon />
          </>
        )}
      </button>

      <div
        className="overflow-hidden [transition:height_0.3s_ease]"
        style={{ height: expanded ? menuRef.current?.clientHeight ?? 0 : 0 }}
      >
        <div ref={menuRef} className={className}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default DropDownMenu;
