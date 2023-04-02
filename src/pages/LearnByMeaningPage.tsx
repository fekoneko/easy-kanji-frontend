import { ViewContent } from '../components/KanjiView';
import LearnUI from '../components/LearnUI';

const frontSide: ViewContent = {
  writing: false,
  meaning: true,
  onReadings: false,
  kunReadings: false,
};

const backSide: ViewContent = {
  writing: true,
  meaning: true,
  onReadings: true,
  kunReadings: true,
};

const LearnByMeaningPage = () => {
  return (
    <div className="onScreenContent ">
      <LearnUI frontSide={frontSide} backSide={backSide} />
    </div>
  );
};
export default LearnByMeaningPage;
