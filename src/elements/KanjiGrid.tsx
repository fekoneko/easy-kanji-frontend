import { Kanji } from '../contexts/kanjiContext';
import KanjiCell from './KanjiCell';

type KanjiGridProps = {
  kanjis: Kanji[];
};

const KanjiGrid = ({ kanjis }: KanjiGridProps) => {
  return (
    <section className="kanjiGrid">
      {kanjis.map((kanji, index) => (
        <KanjiCell key={index} kanji={kanji} />
      ))}
    </section>
  );
};
export default KanjiGrid;
