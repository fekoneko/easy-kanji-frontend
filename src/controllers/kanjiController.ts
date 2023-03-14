import { Kanji } from '../contexts/kanjiContext';

export const isKanjiSelected = (selectedKanjis: Kanji[], kanji: Kanji): boolean =>
  selectedKanjis.findIndex((selectedKanji) => selectedKanji.id === kanji.id) !== -1;

export const selectDeselectKanji = (
  selectedKanjis: Kanji[],
  setSelectedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>,
  kanjiToChange: Kanji
): void => {
  if (isKanjiSelected(selectedKanjis, kanjiToChange)) {
    setSelectedKanjis((prev) => prev.filter((kanji) => kanji.id !== kanjiToChange.id));
  } else {
    setSelectedKanjis((prev) => [...prev, kanjiToChange]);
  }
};

export const isKanjiArraySelected = (selectedKanjis: Kanji[], array: Kanji[]): boolean =>
  array.every(
    (kanji) => selectedKanjis.findIndex((selectedKanji) => selectedKanji.id === kanji.id) !== -1
  );

export const selectKanjiArray = (
  setSelectedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>,
  arrayToSelect: Kanji[]
): void => {
  setSelectedKanjis((prev) => {
    const filteredArray = arrayToSelect.filter((kanjiToSelect) =>
      prev.every((selectedKanji) => kanjiToSelect.id !== selectedKanji.id)
    );
    return [...prev, ...filteredArray];
  });
};

export const deselectKanjiArray = (
  setSelectedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>,
  arrayToDeselect: Kanji[]
): void => {
  setSelectedKanjis((prev) =>
    prev.filter((selectedKanji) =>
      arrayToDeselect.every((kanjiToDeselect) => kanjiToDeselect.id !== selectedKanji.id)
    )
  );
};
