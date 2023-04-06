import { Kanji } from '../contexts/kanjiContext';

export const isKanjiInList = (kanjiList: Kanji[], kanji: Kanji): boolean =>
  kanjiList.findIndex((kanjiFromList) => kanjiFromList.id === kanji.id) !== -1;

export const getKanjisIds = (kanjis: Kanji[]): number[] => kanjis.map((kanji) => kanji.id);

export const changeKanjiInList = (
  setKanjiList: React.Dispatch<React.SetStateAction<Kanji[]>>,
  kanjiToChange: Kanji
): void => {
  setKanjiList((prev) => {
    if (isKanjiInList(prev, kanjiToChange)) {
      return prev.filter((kanji) => kanji.id !== kanjiToChange.id);
    } else {
      return [...prev, kanjiToChange];
    }
  });
};

export const isKanjisInList = (kanjiList: Kanji[], kanjis: Kanji[]): boolean =>
  kanjis.every((kanji) => isKanjiInList(kanjiList, kanji));

export const getCountOfKanjisInList = (kanjiList: Kanji[], kanjis: Kanji[]): number => {
  let count = 0;
  kanjis.forEach((kanji) => isKanjiInList(kanjiList, kanji) && count++);
  return count;
};

export const addKanjiToList = (
  setKanjiList: React.Dispatch<React.SetStateAction<Kanji[]>>,
  kanjiToAdd: Kanji
): void => {
  setKanjiList((prev) => {
    if (isKanjiInList(prev, kanjiToAdd)) return prev;
    return [...prev, kanjiToAdd];
  });
};

export const addKanjisToList = (
  setKanjiList: React.Dispatch<React.SetStateAction<Kanji[]>>,
  kanjisToAdd: Kanji[]
): void => {
  const noRepetetiveIdsArray = kanjisToAdd.filter(
    (kanjiToSelect, kanjiToSelectIndex) =>
      kanjiToSelectIndex ===
      kanjisToAdd.findIndex((kanjiToCompare) => kanjiToSelect.id === kanjiToCompare.id)
  );
  setKanjiList((prev) => {
    const filteredArray = noRepetetiveIdsArray.filter((kanjiToSelect) =>
      prev.every((kanjiFromList) => kanjiToSelect.id !== kanjiFromList.id)
    );
    return [...prev, ...filteredArray];
  });
};

export const removeKanjiFromList = (
  setKanjiList: React.Dispatch<React.SetStateAction<Kanji[]>>,
  kanjiToRemove: Kanji
): void => {
  setKanjiList((prev) => {
    if (isKanjiInList(prev, kanjiToRemove)) return prev;
    return prev.filter((kanji) => kanji.id !== kanjiToRemove.id);
  });
};

export const removeKanjisFromList = (
  setKanjiList: React.Dispatch<React.SetStateAction<Kanji[]>>,
  kanjisToRemove: Kanji[]
): void => {
  setKanjiList((prev) =>
    prev.filter((kanjiFromList) =>
      kanjisToRemove.every((kanjiToDeselect) => kanjiToDeselect.id !== kanjiFromList.id)
    )
  );
};
