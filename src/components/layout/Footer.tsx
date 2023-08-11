import { useContext, useRef, useState } from 'react';
import kanjiContext from '../../contexts/kanjiContext';
import {
  removeKanjisFromList,
  isKanjisInList,
  getCountOfKanjisInList,
  addKanjisToList,
  shuffleKanjiList,
} from '../../controllers/kanjiController';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Info from '../content/Info';
import { Trans, useTranslation } from 'react-i18next';
import settingsContext from '../../contexts/settingsContext';
import { ReactComponent as LightThemeIcon } from '../../assets/lightTheme.svg';
import { ReactComponent as DarkThemeIcon } from '../../assets/darkTheme.svg';

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const footerRef = useRef<HTMLElement>(null);
  const { pageKanjis, setPageKanjis, selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);
  const { theme, setTheme, language, setLanguage } = useContext(settingsContext);
  const [learnModeShuffleFlag, setLearnModeShuffleFlag] = useState<boolean>(false);

  const section = location.pathname.split('/')[1];

  useEffect(() => {
    if (section !== 'learn') return;
    setPageKanjis(selectedKanjis);
  }, [selectedKanjis]);

  useEffect(() => {
    if (section !== 'learn') return;
    if (learnModeShuffleFlag) shuffleKanjiList(setPageKanjis);
    else setPageKanjis(selectedKanjis);
  }, [learnModeShuffleFlag]);

  useEffect(() => {
    setLearnModeShuffleFlag(false);
  }, [location]);

  const deselectAll = () => pageKanjis && removeKanjisFromList(setSelectedKanjis, pageKanjis);
  const selectAll = () => pageKanjis && addKanjisToList(setSelectedKanjis, pageKanjis);
  const clearSelection = () => setSelectedKanjis([]);
  const getSelectedCount = () => pageKanjis && getCountOfKanjisInList(selectedKanjis, pageKanjis);
  const isAllSelected = () => pageKanjis && isKanjisInList(selectedKanjis, pageKanjis);

  const handleLanguageSwitch = () => {
    setLanguage((prev) => (prev === 'ru' ? 'ja' : 'ru'));
  };

  const handleThemeSwitch = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <div className="app-paddings min-h-[1.5px] before:block before:h-full before:w-full before:bg-dark-gray dark:before:bg-gray" />
      <footer
        ref={footerRef}
        role="contentinfo"
        className="app-paddings flex gap-2 py-0.5 text-dark-gray dark:text-gray hover:[&_button]:text-black dark:hover:[&_button]:text-white"
      >
        {(() => {
          switch (section) {
            case 'popular':
            case 'saved':
            case 'search':
              return (
                <>
                  <p>
                    <Trans
                      i18nKey="Layout.Footer.SelectedOf"
                      values={{
                        selected: pageKanjis ? getSelectedCount() : '?',
                        of: pageKanjis?.length ?? '?',
                      }}
                    />
                  </p>
                  {isAllSelected() ? (
                    <button className="ml-auto" onClick={deselectAll}>
                      {t('Layout.Footer.DeselectAll')}
                    </button>
                  ) : (
                    <button className="ml-auto" onClick={selectAll}>
                      {t('Layout.Footer.SelectAll')}
                    </button>
                  )}
                </>
              );

            case 'selected':
              return (
                <>
                  <p>
                    <Trans
                      i18nKey="Layout.Footer.Selected"
                      values={{ selected: selectedKanjis ? selectedKanjis.length : '?' }}
                    />
                  </p>
                  <button className="ml-auto" onClick={clearSelection}>
                    {t('Layout.Footer.ClearList')}
                  </button>
                </>
              );

            case 'learn':
              return (
                <>
                  <Info tooltipAnchorRef={footerRef} caption={t('Layout.Footer.HelpCaption')}>
                    <Trans
                      i18nKey="Pages.Learn.Info"
                      components={{
                        p: <p />,
                        ul: <ul />,
                        li: <li />,
                        key: <span className="key" />,
                      }}
                    />
                  </Info>
                  <button
                    className="ml-auto"
                    onClick={(e: any) => {
                      setLearnModeShuffleFlag((prev) => !prev);
                      e.target.blur();
                    }}
                  >
                    {learnModeShuffleFlag
                      ? t('Layout.Footer.CardsShuffled')
                      : t('Layout.Footer.ShuffleCards')}
                  </button>
                </>
              );

            default:
              return (
                <>
                  <p>EasyKanji</p>
                  <Link className="ml-auto" to="/feedback">
                    {t('Layout.Footer.LeaveFeedback')}
                  </Link>
                </>
              );
          }
        })()}
        <button onClick={handleLanguageSwitch}>{language === 'ja' ? 'jap' : 'rus'}</button>
        <button
          onClick={handleThemeSwitch}
          className="[&>svg]:fill-dark-gray hover:[&>svg]:fill-black dark:[&>svg]:fill-gray dark:hover:[&>svg]:fill-white"
        >
          {theme === 'light' ? <LightThemeIcon /> : <DarkThemeIcon />}
        </button>
      </footer>
    </>
  );
};
export default Footer;
