import FeedbackForm from '../components/forms/FeedbackForm';
import TitledPage from '../components/routing/TitledPage';

const FeedbackPage = () => {
  return (
    <TitledPage title="Оставить отзыв">
      <div className="scrollContent">
        <h1 className="pageTitle">Оставить отзыв</h1>
        <FeedbackForm />
      </div>
    </TitledPage>
  );
};
export default FeedbackPage;
