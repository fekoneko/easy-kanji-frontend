import { useTranslation } from 'react-i18next';
import FeedbackForm from '../components/forms/FeedbackForm';
import TitledPage from '../components/routing/TitledPage';

const FeedbackPage = () => {
  const { t } = useTranslation();

  return (
    <TitledPage title={t('Pages.Feedback.Title')}>
      <div className="scrollContent">
        <h1 className="pageTitle">{t('Pages.Feedback.Title')}</h1>
        <FeedbackForm />
      </div>
    </TitledPage>
  );
};
export default FeedbackPage;
