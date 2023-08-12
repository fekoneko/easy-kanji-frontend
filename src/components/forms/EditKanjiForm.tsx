import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import TextArrayInputs from './TextArrayInputs';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import Tooltip from '../overlays/Tooltip';
import kanjisApi from '../../api/kanjisApi';
import usePopup from '../../hooks/usePopup';
import { editKanjiInList } from '../../controllers/kanjiController';
import useAbortController from '../../hooks/useAbortController';
import LoadingSpinner from '../animations/LoadingSpinner';
import { useTranslation } from 'react-i18next';

type EditKanjiFormProps = {
  initialKanji: Kanji | null;
};

const EditKanjiForm = ({ initialKanji }: EditKanjiFormProps) => {
  const { t } = useTranslation();

  const [kanjiWriting, setKanjWriting] = useState('');
  const [kanjiWritingValid, setKanjiWritingValid] = useState(false);
  const [kanjiWritingFocus, setKanjiWritingFocus] = useState(false);
  const kanjiWritingRef = useRef<HTMLInputElement>(null);

  const [kanjiOnReadings, setKanjOnReadings] = useState<string[]>([]);
  const [kanjiKunReadings, setKanjKunReadings] = useState<string[]>([]);
  const [kanjiMeaning, setKanjMeaning] = useState('');

  const submitRef = useRef<HTMLButtonElement>(null);
  const [editOrAddErrorStatus, setEditOrAddErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();
  const { setPageKanjis, setSavedKanjis, setSelectedKanjis } = useContext(kanjiContext);

  useEffect(() => {
    setEditOrAddErrorStatus(null);
  }, [kanjiWriting, kanjiOnReadings, kanjiKunReadings, kanjiMeaning]);

  useEffect(() => {
    if (editOrAddErrorStatus) showPopup(t('Forms.EditKanjis.Errors.EditOrAddFailed'));
  }, [editOrAddErrorStatus]);

  useEffect(() => {
    setKanjWriting(initialKanji?.writing ?? '');
    setKanjOnReadings(initialKanji?.onReadings ?? []);
    setKanjKunReadings(initialKanji?.kunReadings ?? []);
    setKanjMeaning(initialKanji?.meaning ?? '');

    setLoading(false);
  }, [initialKanji]);

  useEffect(() => {
    setKanjiWritingValid(kanjiWriting.length <= 1);
  }, [kanjiWriting]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newKanji: Kanji = {
      id: initialKanji?.id ?? -1,
      writing: kanjiWriting,
      onReadings: kanjiOnReadings,
      kunReadings: kanjiKunReadings,
      meaning: kanjiMeaning,
    };
    if (initialKanji) {
      const editSuccess = await kanjisApi.editKanji(
        initialKanji.id,
        newKanji,
        setEditOrAddErrorStatus,
        setLoading,
        abortControllerRef.current.signal
      );

      if (!editSuccess) return;
      editKanjiInList(setPageKanjis, newKanji);
      editKanjiInList(setSavedKanjis, newKanji);
      editKanjiInList(setSelectedKanjis, newKanji);
    } else {
      await kanjisApi.addKanji(
        newKanji,
        setEditOrAddErrorStatus,
        setLoading,
        abortControllerRef.current.signal
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-4 grid gap-2 [grid-template-columns:minmax(0,0.6fr)_minmax(0,1.4fr)]"
    >
      <label htmlFor="kanjiWritingInput">{t('Forms.EditKanjis.Writing')}</label>
      <input
        ref={kanjiWritingRef}
        required
        id="kanjiWritingInput"
        className="h-12 w-14 justify-self-center text-center text-2xl"
        type="text"
        placeholder="字"
        value={kanjiWriting}
        onChange={(e) => setKanjWriting(e.target.value)}
        onFocus={() => setKanjiWritingFocus(true)}
        onBlur={() => setKanjiWritingFocus(false)}
        aria-invalid={!kanjiWritingValid}
      />
      <Tooltip shown={!kanjiWritingValid && kanjiWritingFocus} anchorRef={kanjiWritingRef}>
        {t('Forms.EditKanjis.Errors.WritingHint')}
      </Tooltip>

      <label htmlFor="kanjiMeaningInput">{t('Forms.EditKanjis.Meaning')}</label>
      <input
        required
        id="kanjiMeaningInput"
        type="text"
        placeholder={t('Forms.EditKanjis.MeaningPlaceholder')}
        value={kanjiMeaning}
        onChange={(e) => setKanjMeaning(e.target.value)}
      />

      <TextArrayInputs
        array={kanjiOnReadings}
        setArray={setKanjOnReadings}
        name={t('Forms.EditKanjis.OnReadings')}
        ids="kanjiOnReadingsInputs"
        placeholder="–"
      />

      <TextArrayInputs
        array={kanjiKunReadings}
        setArray={setKanjKunReadings}
        name={t('Forms.EditKanjis.KunReadings')}
        ids="kanjiKunReadingsInputs"
        placeholder="–"
      />

      <button type="submit" ref={submitRef} className="col-span-2">
        {loading ? (
          <LoadingSpinner small />
        ) : initialKanji ? (
          t('Forms.EditKanjis.Edit')
        ) : (
          t('Forms.EditKanjis.Add')
        )}
      </button>
    </form>
  );
};
export default EditKanjiForm;
