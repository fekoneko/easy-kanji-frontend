import { FormEvent, useEffect, useRef, useState } from 'react';
import TextArrayInputs from './TextArrayInputs';
import { Kanji } from '../../contexts/kanjiContext';
import { PublicListName } from '../layout/EditKanjisUI';
import Tooltip from '../content/Tooltip';

type EditKanjiFormProps = {
  initialKanji: Kanji | null;
  onSubmit?: (newKanji: Kanji) => any;
  errorShown?: boolean;
};

const EditKanjiForm = ({ initialKanji, onSubmit, errorShown }: EditKanjiFormProps) => {
  const [kanjiWriting, setKanjWriting] = useState('');
  const [kanjiOnReadings, setKanjOnReadings] = useState<string[]>([]);
  const [kanjiKunReadings, setKanjKunReadings] = useState<string[]>([]);
  const [kanjiMeaning, setKanjMeaning] = useState('');
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!initialKanji) return;
    setKanjWriting(initialKanji.writing);
    setKanjOnReadings(initialKanji.onReadings);
    setKanjKunReadings(initialKanji.kunReadings);
    setKanjMeaning(initialKanji.meaning);
  }, [initialKanji]);

  useEffect(() => {
    if (kanjiWriting.length > 1) setKanjWriting(kanjiWriting[0]);
  }, [kanjiWriting]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit)
      onSubmit({
        id: initialKanji?.id ?? -1,
        writing: kanjiWriting,
        onReadings: kanjiOnReadings,
        kunReadings: kanjiKunReadings,
        meaning: kanjiMeaning,
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="kanjiWritingInput">Кандзи:</label>
        <input
          required
          id="kanjiWritingInput"
          type="text"
          placeholder="Введите кандзи"
          value={kanjiWriting}
          onChange={(e) => setKanjWriting(e.target.value)}
          maxLength={1}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="kanjiMeaningInput">Значение:</label>
        <input
          required
          id="kanjiMeaningInput"
          type="text"
          placeholder="Введите значение"
          value={kanjiMeaning}
          onChange={(e) => setKanjMeaning(e.target.value)}
        />
      </fieldset>

      <TextArrayInputs
        array={kanjiOnReadings}
        setArray={setKanjOnReadings}
        name="Оны"
        ids="kanjiOnReadingsInputs"
        placeholder="Введите чтение"
      />

      <TextArrayInputs
        array={kanjiKunReadings}
        setArray={setKanjKunReadings}
        name="Куны"
        ids="kanjiKunReadingsInputs"
        placeholder="Введите чтение"
      />

      <button type="submit" ref={submitRef}>
        {initialKanji ? 'Изменить' : 'Добавить'}
      </button>
      <Tooltip shown={errorShown} anchorRef={submitRef}>
        Не удалось сохранить
      </Tooltip>
    </form>
  );
};
export default EditKanjiForm;
