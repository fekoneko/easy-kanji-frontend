import { Kanji } from '../../contexts/kanjiContext';
import KanjiReadings from './KanjiReadings';

export type ViewContent = {
  writing: boolean;
  meaning: boolean;
  onReadings: boolean;
  kunReadings: boolean;
};

type KanjiViewProps = {
  kanji: Kanji;
  viewContent: ViewContent;
};

const KanjiView = ({ kanji, viewContent }: KanjiViewProps) => {
  return (
    <div className="kanjiView">
      {viewContent.writing && <p className="kanjiWriting">{kanji.writing}</p>}
      {viewContent.meaning && (
        <p className={`kanjiMeaning${!viewContent.writing ? ' main' : ''}`}>{kanji.meaning}</p>
      )}
      {viewContent.onReadings && (
        <p className="kanjiOnReadings">
          <KanjiReadings readings={kanji.onReadings} />
        </p>
      )}
      {viewContent.kunReadings && (
        <p className="kanjiKunReadings">
          <KanjiReadings readings={kanji.kunReadings} />
        </p>
      )}
    </div>
  );
};
export default KanjiView;
