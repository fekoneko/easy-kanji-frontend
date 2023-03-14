import { Kanji } from '../contexts/kanjiContext';

export const isKanjiSelected = (selectedKanjis: Kanji[], kanji: Kanji): boolean =>
  selectedKanjis.findIndex((selectedKanji) => selectedKanji.id === kanji.id) !== -1;

export const selectDeselectKanji = (
  selectedKanjis: Kanji[],
  setSelectedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>,
  kanjiToSelect: Kanji
): void => {
  if (isKanjiSelected(selectedKanjis, kanjiToSelect)) {
    setSelectedKanjis((prev) => prev.filter((kanji) => kanji.id !== kanjiToSelect.id));
  } else {
    setSelectedKanjis((prev) => [...prev, kanjiToSelect]);
  }
};
