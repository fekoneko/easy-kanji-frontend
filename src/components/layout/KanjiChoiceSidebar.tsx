import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiGrid from '../content/KanjiGrid';
import { NavLink } from 'react-router-dom';
import useDynamicScroll from '../../hooks/useDynamicScroll';
import kanjisApi from '../../api/kanjisApi';
import useAbortController from '../../hooks/useAbortController';
import useToast from '../../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import Loading from '../content/Loading';
import useLoading from '../../hooks/useLoading';

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
  const { showToast } = useToast();
  const [trackKanjiLoading, kanjiLoadingStatus] = useLoading();

  const abortControllerRef = useAbortController();

  const links: Link[] = [{ title: 'Popular', to: '/edit/popular' }];

  useDynamicScroll(scrollContainerRef, kanjis, setKanjis, async (startIndex, endIndex) => {
    const [kanjis] = await trackKanjiLoading(
      () =>
        kanjisApi.getKanjiListPart(
          'popular',
          startIndex,
          endIndex,
          abortControllerRef.current.signal
        ),
      undefined,
      () => showToast(t('KanjiGrid.Errors.LoadingFailed'))
    );
    return kanjis as Kanji[] | null;
  });

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
      ) : (
        <Loading status={kanjiLoadingStatus}>
          <div className="content-placeholder">
            <Trans i18nKey="Pages.Popular.Placeholder" components={{ p: <p /> }} />
          </div>
        </Loading>
      )}
    </aside>
  );
};
export default KanjiChoiceSidebar;
