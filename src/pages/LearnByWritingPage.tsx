import { SideContent } from '../elements/KanjiCard';
import LearnUI from '../elements/LearnUI';

const frontSide: SideContent = {
  writing: true,
  meaning: false,
  onReadings: false,
  kunReadings: false,
};

const backSide: SideContent = {
  writing: true,
  meaning: true,
  onReadings: true,
  kunReadings: true,
};

const LearnByWritingPage = () => {
  return (
    <div className="mainContent">
      <LearnUI frontSide={frontSide} backSide={backSide} />
    </div>
  );
};
export default LearnByWritingPage;
