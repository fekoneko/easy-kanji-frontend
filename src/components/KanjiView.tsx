import { Kanji } from '../contexts/kanjiContext';

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
          {kanji.onReadings.map((reading, index) => (
            <span key={index}>
              {reading}
              {index < kanji.onReadings.length - 1 && '、'}
            </span>
          ))}
        </p>
      )}
      {viewContent.kunReadings && (
        <p className="kanjiKunReadings">
          {kanji.kunReadings.map((reading, index) => (
            <span key={index}>
              {reading}
              {index < kanji.kunReadings.length - 1 && '、'}
            </span>
          ))}
        </p>
      )}
    </div>
  );
};
export default KanjiView;
