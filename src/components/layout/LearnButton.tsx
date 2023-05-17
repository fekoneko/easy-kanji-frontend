import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const LearnButton = () => {
  const { t } = useTranslation();
  const location = useLocation();

  if (location.pathname.split('/')[1] === 'learn') {
    return (
      <Link className="learnButton" to={location.state?.from ?? '/popular'}>
        <div>{t('Layout.Header.LeaveLearnMode')}</div>
      </Link>
    );
  } else {
    return (
      <Link className="learnButton" to="/learn/by-meaning" state={{ from: location.pathname }}>
        <div>{t('Layout.Header.LearnMode')}</div>
      </Link>
    );
  }
};
export default LearnButton;
