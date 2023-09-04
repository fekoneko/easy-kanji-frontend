import { Kanji } from '../../contexts/kanjisContext';
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
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center">
      {viewContent.writing && <p className="text-6xl">{kanji.writing}</p>}
      {viewContent.meaning && (
        <p className={viewContent.writing ? 'text-xl' : 'text-2xl font-bold'}>{kanji.meaning}</p>
      )}
      {viewContent.onReadings && (
        <p>
          <KanjiReadings readings={kanji.onReadings} />
        </p>
      )}
      {viewContent.kunReadings && (
        <p>
          <KanjiReadings readings={kanji.kunReadings} />
        </p>
      )}
    </div>
  );
};
export default KanjiView;
