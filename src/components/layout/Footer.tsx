import { useRef } from 'react';
import FooterControls from './FooterControls';
import LanguageSwitch from './LanguageSwitch';
import ThemeSwitch from './ThemeSwitch';
import ShowAtMedia from './ShowAtMedia';

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer ref={footerRef} role="contentinfo" className="app-paddings">
      <div className="h-[1.5px] w-full bg-dark-gray dark:bg-gray" />
      <div className="flex gap-2 py-0.5 text-dark-gray dark:text-gray hover:[&_a]:text-black hover:[&_a]:no-underline dark:hover:[&_a]:text-white dark:hover:[&_a]:transition-colors hover:[&_button]:text-black dark:hover:[&_button]:text-white">
        <FooterControls footerRef={footerRef} />
        <ShowAtMedia min="xs">
          <LanguageSwitch mini />
          <ThemeSwitch mini />
        </ShowAtMedia>
      </div>
    </footer>
  );
};
export default Footer;
