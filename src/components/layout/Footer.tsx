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

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const footerRef = useRef<HTMLElement>(null);
  const { pageKanjis, setPageKanjis, selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);
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

  return (
    <footer ref={footerRef} role="contentinfo">
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
                  <button onClick={deselectAll}>{t('Layout.Footer.DeselectAll')}</button>
                ) : (
                  <button onClick={selectAll}>{t('Layout.Footer.SelectAll')}</button>
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
                <button onClick={clearSelection}>{t('Layout.Footer.ClearList')}</button>
              </>
            );

          case 'learn':
            return (
              <>
                <Info tooltipAnchorRef={footerRef} caption={t('Layout.Footer.HelpCaption')}>
                  <Trans
                    i18nKey="Pages.Learn.Info"
                    components={{ p: <p />, ul: <ul />, li: <li />, span: <span /> }}
                  />
                </Info>
                <button
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
                <Link to="/feedback">{t('Layout.Footer.LeaveFeedback')}</Link>
              </>
            );
        }
      })()}
    </footer>
  );
};
export default Footer;
