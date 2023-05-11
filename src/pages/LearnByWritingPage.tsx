import { ViewContent } from '../components/content/KanjiView';
import LearnUI from '../components/layout/LearnUI';
import TitledPage from '../components/routing/TitledPage';

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
    <TitledPage title="Изучение кандзи">
      <div className="onScreenContent">
        <LearnUI frontSide={frontSide} backSide={backSide} />
      </div>
    </TitledPage>
  );
};
export default LearnByWritingPage;
