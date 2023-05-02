import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Kanji } from '../../contexts/kanjiContext';

type KanjiChoiceCellProps = {
  kanji: Kanji;
  focus?: boolean;
  setFocus?: () => any;
  chosenKanji?: Kanji | null;
  setChosenKanji?: Dispatch<SetStateAction<Kanji | null>>;
};

const KanjiChoiceCell = ({
  kanji,
  focus,
  setFocus,
  chosenKanji,
  setChosenKanji,
}: KanjiChoiceCellProps) => {
  const cellButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focus) cellButtonRef.current?.focus();
    else cellButtonRef.current?.blur();
  }, [focus]);

  const chooseKanji = () => {
    if (setFocus) setFocus();
    if (setChosenKanji) setChosenKanji((prev) => (prev?.id === kanji.id ? null : kanji));
  };

  return (
    <div className={`kanjiCell${kanji.id === chosenKanji?.id ? ' selected' : ''}`}>
      <button
        tabIndex={focus ? undefined : -1}
        ref={cellButtonRef}
        className="kanjiCellButton"
        onClick={chooseKanji}
      >
        <p className="kanjiWriting">{kanji.writing}</p>
        <div>
          <p className="kanjiMeaning">{kanji.meaning}</p>
          <p className="kanjiOnReadings">{kanji.onReadings.join('、')}</p>
          <p className="kanjiKunReadings">{kanji.kunReadings.join('、')}</p>
        </div>
      </button>
    </div>
  );
};
export default KanjiChoiceCell;
