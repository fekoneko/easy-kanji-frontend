import { SideContent } from '../elements/KanjiCard';
import LearnUI from '../elements/LearnUI';

const frontSide: SideContent = {
  writing: false,
  meaning: true,
  onReadings: false,
  kunReadings: false,
};

const backSide: SideContent = {
  writing: true,
  meaning: true,
  onReadings: true,
  kunReadings: true,
};

const LearnByMeaningPage = () => {
  return (
    <div className="mainContent">
      <LearnUI frontSide={frontSide} backSide={backSide} />
    </div>
  );
};
export default LearnByMeaningPage;
