import { Link } from 'react-router-dom';
import EditUserForm from '../components/forms/EditUserForm';
import TitledPage from '../components/routing/TitledPage';
import { useTranslation } from 'react-i18next';

const EditUserPage = () => {
  const { t } = useTranslation();

  return (
    <TitledPage title={t('Pages.EditUser.Title')}>
      <div className="scrollContent">
        <h1 className="pageTitle">{t('Pages.EditUser.Title')}</h1>
        <EditUserForm />
        <Link to="/user" style={{ alignSelf: 'flex-end' }}>
          {t('Pages.EditUser.BackLink')}
        </Link>
      </div>
    </TitledPage>
  );
};
export default EditUserPage;
