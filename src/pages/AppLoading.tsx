import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const AppLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-4">
      <h1>{t('SiteTitle')}</h1>
      <LoadingSpinner className="m-0" />
    </div>
  );
};
export default AppLoading;
