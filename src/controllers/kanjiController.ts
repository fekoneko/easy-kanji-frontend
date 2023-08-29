import { Dispatch, SetStateAction } from 'react';
import { Kanji } from '../contexts/kanjiContext';

type setKanjiList = Dispatch<SetStateAction<Kanji[]>>;

export const isKanjiInList = (kanjiList: Kanji[], kanji: Kanji): boolean =>
  kanjiList.findIndex((kanjiFromList) => kanjiFromList.id === kanji.id) !== -1;

export const getKanjisIds = (kanjis: Kanji[]): number[] => kanjis.map((kanji) => kanji.id);

export const changeKanjiInList = (setKanjiList: setKanjiList, kanjiToChange: Kanji): void => {
  setKanjiList((prev) => {
    if (isKanjiInList(prev, kanjiToChange)) {
      return prev.filter((kanji) => kanji.id !== kanjiToChange.id);
    } else {
      return [...prev, kanjiToChange];
    }
  });
};

export const editKanjiInList = (setKanjiList: setKanjiList, editedKanji: Kanji): void => {
  setKanjiList((prev) => prev.map((kanji) => (kanji.id === editedKanji.id ? editedKanji : kanji)));
};

export const isKanjisInList = (kanjiList: Kanji[], kanjis: Kanji[]): boolean =>
  kanjis.every((kanji) => isKanjiInList(kanjiList, kanji));

export const getCountOfKanjisInList = (kanjiList: Kanji[], kanjis: Kanji[]): number => {
  let count = 0;
  kanjis.forEach((kanji) => isKanjiInList(kanjiList, kanji) && count++);
  return count;
};

export const addKanjiToList = (setKanjiList: setKanjiList, kanjiToAdd: Kanji): void => {
  setKanjiList((prev) => {
    if (isKanjiInList(prev, kanjiToAdd)) return prev;
    return [...prev, kanjiToAdd];
  });
};

export const addKanjisToList = (setKanjiList: setKanjiList, kanjisToAdd: Kanji[]): void => {
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

export const removeKanjiFromList = (setKanjiList: setKanjiList, kanjiToRemove: Kanji): void => {
  setKanjiList((prev) => prev.filter((kanji) => kanji.id !== kanjiToRemove.id));
};

export const removeKanjisFromList = (setKanjiList: setKanjiList, kanjisToRemove: Kanji[]): void => {
  setKanjiList((prev) =>
    prev.filter((kanjiFromList) =>
      kanjisToRemove.every((kanjiToDeselect) => kanjiToDeselect.id !== kanjiFromList.id)
    )
  );
};

export const shuffleKanjiList = (setKanjiList: setKanjiList): void => {
  const shuffleKanjis = (kanjis: Kanji[]): Kanji[] => {
    const newKanjis = [...kanjis];
    for (let i = newKanjis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newKanjis[i], newKanjis[j]] = [newKanjis[j], newKanjis[i]];
    }
    return newKanjis;
  };

  setKanjiList((prev) => shuffleKanjis(prev));
};

export const compareKanjiLists = (kanjiList1: Kanji[], kanjiList2: Kanji[]) =>
  kanjiList1.length === kanjiList2.length &&
  kanjiList1.every((kanji1) => kanjiList2.some((kanji2) => kanji1.id === kanji2.id));
