import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <TitledPage title={t('Pages.Learn.Title')}>
      <div className="onScreenContent">
        <LearnUI frontSide={frontSide} backSide={backSide} />
      </div>
    </TitledPage>
  );
};
export default LearnByWritingPage;
