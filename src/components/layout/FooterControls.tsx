import { RefObject, useContext, useEffect, useState } from 'react';
import kanjisContext, { Kanji } from '../../contexts/kanjisContext';
import {
  removeKanjisFromList,
  isKanjisInList,
  getCountOfKanjisInList,
  addKanjisToList,
  shuffleKanjiList,
} from '../../controllers/kanjiController';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Info from '../content/Info';
import { Trans, useTranslation } from 'react-i18next';

type FooterControlsProps = {
  footerRef: RefObject<HTMLElement>;
};

const FooterControls = ({ footerRef }: FooterControlsProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const {
    popularKanjis,
    savedKanjis,
    searchKanjis,
    selectedKanjis,
    setSelectedKanjis,
    learnKanjis,
    setLearnKanjis,
  } = useContext(kanjisContext);
  const [learnModeShuffleFlag, setLearnModeShuffleFlag] = useState<boolean>(false);

  const section = location.pathname.split('/')[1];

  useEffect(() => {
    if (section === 'learn') {
      if (learnModeShuffleFlag) shuffleKanjiList(setLearnKanjis);
      else setLearnKanjis(selectedKanjis);
    }
  }, [learnModeShuffleFlag]);

  useEffect(() => {
    setLearnModeShuffleFlag(false);
  }, [selectedKanjis]);

  let pageKanjis: Kanji[] | null;

  if (section === 'popular') pageKanjis = popularKanjis;
  else if (section === 'saved') pageKanjis = savedKanjis;
  else if (section === 'search') pageKanjis = searchKanjis;
  else if (section === 'selected') pageKanjis = selectedKanjis;
  else if (section === 'learn') pageKanjis = learnKanjis;
  else pageKanjis = null;

  const deselectAll = () => pageKanjis && removeKanjisFromList(setSelectedKanjis, pageKanjis);
  const selectAll = () => pageKanjis && addKanjisToList(setSelectedKanjis, pageKanjis);
  const clearSelection = () => setSelectedKanjis([]);
  const getSelectedCount = () => pageKanjis && getCountOfKanjisInList(selectedKanjis, pageKanjis);
  const isAllSelected = () => pageKanjis && isKanjisInList(selectedKanjis, pageKanjis);

  switch (section) {
    case 'popular':
    case 'saved':
    case 'search':
      return (
        <div className="flex flex-grow justify-between gap-2">
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
        </div>
      );

    case 'selected':
      return (
        <div className="flex flex-grow justify-between gap-2">
          <p>
            <Trans
              i18nKey="Layout.Footer.Selected"
              values={{ selected: selectedKanjis ? selectedKanjis.length : '?' }}
            />
          </p>
          <button onClick={clearSelection}>{t('Layout.Footer.ClearList')}</button>
        </div>
      );

    case 'learn':
      return (
        <div className="flex flex-grow justify-between gap-2">
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
            onClick={(e: any) => {
              setLearnModeShuffleFlag((prev) => !prev);
              e.target.blur();
            }}
          >
            {learnModeShuffleFlag
              ? t('Layout.Footer.CardsShuffled')
              : t('Layout.Footer.ShuffleCards')}
          </button>
        </div>
      );

    default:
      return (
        <div className="flex flex-grow justify-between gap-2">
          <p>EasyKanji</p>
          <Link className="ml-auto [color:inherit]" to="/feedback">
            {t('Layout.Footer.LeaveFeedback')}
          </Link>
        </div>
      );
  }
};
export default FooterControls;
