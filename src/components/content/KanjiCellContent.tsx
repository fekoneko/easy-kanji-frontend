import { Kanji } from '../../contexts/kanjisContext';
import KanjiReadings from './KanjiReadings';

type KanjiCellContentProps = {
  kanji: Kanji;
  detailedMode?: boolean;
};

const KanjiCellContent = ({ kanji, detailedMode }: KanjiCellContentProps) => {
  return (
    <div className="flex items-center gap-1">
      <p className="p-2 text-3xl font-bold">{kanji.writing}</p>
      <div className="flex flex-col items-start">
        <p className="overflow-hidden text-left">
          {kanji.meaning.length > 25 ? `${kanji.meaning.slice(0, 22)}...` : kanji.meaning}
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
