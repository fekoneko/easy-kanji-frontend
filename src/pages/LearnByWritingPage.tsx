import { ViewContent } from '../components/content/KanjiView';
import LearnUI from '../components/layout/LearnUI';

const frontSide: ViewContent = {
  writing: true,
  meaning: false,
  onReadings: false,
  kunReadings: false,
};

const backSide: ViewContent = {
  writing: true,
  meaning: true,
  onReadings: true,
  kunReadings: true,
};

const LearnByWritingPage = () => {
  return (
    <div className="onScreenContent">
      <LearnUI frontSide={frontSide} backSide={backSide} />
    </div>
  );
};
export default LearnByWritingPage;
