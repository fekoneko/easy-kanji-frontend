import { Kanji } from '../../contexts/kanjiContext';
import KanjiReadings from './KanjiReadings';

type KanjiCellContentProps = {
  kanji: Kanji;
  detailedMode?: boolean;
};

const KanjiCellContent = ({ kanji, detailedMode }: KanjiCellContentProps) => {
  return (
    <div className="flex items-center">
      <p className="p-2 text-3xl font-bold">{kanji.writing}</p>
      <div className="flex flex-col items-start">
        <p className="overflow-hidden">
          {kanji.meaning.length > 24 ? `${kanji.meaning.slice(0, 24)}...` : kanji.meaning}
        </p>
        {detailedMode && (
          <>
            <p className="text-xs">
              <KanjiReadings readings={kanji.onReadings} />
            </p>
            <p className="text-xs">
              <KanjiReadings readings={kanji.kunReadings} />
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default KanjiCellContent;