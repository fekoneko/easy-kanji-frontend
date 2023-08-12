import { useTranslation } from 'react-i18next';
import FeedbackForm from '../components/forms/FeedbackForm';
import TitledPage from '../components/routing/TitledPage';

const FeedbackPage = () => {
  const { t } = useTranslation();

  return (
    <TitledPage title={t('Pages.Feedback.Title')}>
      <h1 className="mb-4 mt-7">{t('Pages.Feedback.Title')}</h1>

      <FeedbackForm />
    </TitledPage>
  );
};
export default FeedbackPage;
