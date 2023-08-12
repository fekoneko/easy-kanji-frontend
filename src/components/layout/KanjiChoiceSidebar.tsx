import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiGrid from '../content/KanjiGrid';
import { NavLink } from 'react-router-dom';
import useDynamicScroll from '../../hooks/useDynamicScroll';
import kanjisApi from '../../api/kanjisApi';
import useAbortController from '../../hooks/useAbortController';
import usePopup from '../../hooks/usePopup';
import LoadingSpinner from '../animations/LoadingSpinner';
import { Trans, useTranslation } from 'react-i18next';

type Link = { title: string; to: string };

type KanjiSelectionSidebarProps = {
  kanjis: Kanji[];
  setKanjis: Dispatch<SetStateAction<Kanji[]>>;
  chosenKanji: Kanji | null;
  setChosenKanji: Dispatch<SetStateAction<Kanji | null>>;
};

const KanjiChoiceSidebar = ({
  kanjis,
  setKanjis,
  chosenKanji,
  setChosenKanji,
}: KanjiSelectionSidebarProps) => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { showPopup } = usePopup();
  const [loading, setLoading] = useState(false);
  const [getKanjisErrorStatus, setGetKanjisErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();

  const links: Link[] = [{ title: 'Popular', to: '/edit/popular' }];

  useDynamicScroll(scrollContainerRef, kanjis, setKanjis, (startIndex, endIndex) =>
    kanjisApi.getKanjiListPart(
      'popular',
      startIndex,
      endIndex,
      setGetKanjisErrorStatus,
      setLoading,
      abortControllerRef.current.signal
    )
  );

  useEffect(() => {
    if (getKanjisErrorStatus) showPopup(t('KanjiGrid.Errors.LoadingFailed'));
  }, [getKanjisErrorStatus]);

  return (
    <aside className="flex h-[20rem] flex-col">
      <nav>
        {links.map((link, index) => (
          <NavLink to={link.to} key={index}>
            {link.title}
          </NavLink>
        ))}
      </nav>
      {kanjis.length > 0 ? (
        <div ref={scrollContainerRef} className="overflow-y-scroll">
          <KanjiGrid
            kanjis={kanjis}
            maxColumns={1}
            kanjiChoiceMode
            chosenKanji={chosenKanji}
            setChosenKanji={setChosenKanji}
            detailedMode
          />
        </div>
      ) : loading ? (
        <div className="content-placeholder">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="content-placeholder">
          <Trans i18nKey="Pages.Popular.Placeholder" components={{ p: <p /> }} />
        </div>
      )}
    </aside>
  );
};
export default KanjiChoiceSidebar;
