import { FormEvent, useEffect, useRef, useState } from 'react';
import TextArrayInputs from './TextArrayInputs';
import { Kanji } from '../../contexts/kanjiContext';
import Tooltip from '../content/Tooltip';
import kanjisApi from '../../api/kanjisApi';
import usePopup from '../../hooks/usePopup';

type EditKanjiFormProps = {
  initialKanji: Kanji | null;
};

const EditKanjiForm = ({ initialKanji }: EditKanjiFormProps) => {
  const [kanjiWriting, setKanjWriting] = useState('');
  const [kanjiWritingValid, setKanjiWritingValid] = useState(false);
  const [kanjiWritingFocus, setKanjiWritingFocus] = useState(false);
  const kanjiWritingRef = useRef<HTMLInputElement>(null);

  const [kanjiOnReadings, setKanjOnReadings] = useState<string[]>([]);
  const [kanjiKunReadings, setKanjKunReadings] = useState<string[]>([]);
  const [kanjiMeaning, setKanjMeaning] = useState('');

  const submitRef = useRef<HTMLButtonElement>(null);
  const [editOrAddErrorStatus, setEditOrAddErrorStatus] = useState<number | null>(null);
  const { showPopup } = usePopup();

  useEffect(() => {
    setEditOrAddErrorStatus(null);
  }, [kanjiWriting, kanjiOnReadings, kanjiKunReadings, kanjiMeaning]);

  useEffect(() => {
    if (editOrAddErrorStatus) showPopup('При сохранении возникла ошибка');
  }, [editOrAddErrorStatus]);

  useEffect(() => {
    setKanjWriting(initialKanji?.writing ?? '');
    setKanjOnReadings(initialKanji?.onReadings ?? []);
    setKanjKunReadings(initialKanji?.kunReadings ?? []);
    setKanjMeaning(initialKanji?.meaning ?? '');
  }, [initialKanji]);

  useEffect(() => {
    setKanjiWritingValid(kanjiWriting.length <= 1);
  }, [kanjiWriting]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newKanji: Kanji = {
      id: -1,
      writing: kanjiWriting,
      onReadings: kanjiOnReadings,
      kunReadings: kanjiKunReadings,
      meaning: kanjiMeaning,
    };
    if (initialKanji) {
      await kanjisApi.editKanji(initialKanji.id, newKanji, setEditOrAddErrorStatus);
    } else {
      await kanjisApi.addKanji(newKanji, setEditOrAddErrorStatus); // TODO: add to kanji list
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="kanjiWritingInput">Кандзи:</label>
        <input
          ref={kanjiWritingRef}
          required
          id="kanjiWritingInput"
          className="kanjiWritingInput"
          type="text"
          placeholder="字"
          value={kanjiWriting}
          onChange={(e) => setKanjWriting(e.target.value)}
          onFocus={() => setKanjiWritingFocus(true)}
          onBlur={() => setKanjiWritingFocus(false)}
          aria-invalid={!kanjiWritingValid}
        />
      </fieldset>
      <Tooltip shown={!kanjiWritingValid && kanjiWritingFocus} anchorRef={kanjiWritingRef}>
        Введите один символ
      </Tooltip>

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
        placeholder="–"
      />

      <TextArrayInputs
        array={kanjiKunReadings}
        setArray={setKanjKunReadings}
        name="Куны"
        ids="kanjiKunReadingsInputs"
        placeholder="–"
      />

      <button type="submit" ref={submitRef}>
        {initialKanji ? 'Изменить' : 'Добавить'}
      </button>
    </form>
  );
};
export default EditKanjiForm;
