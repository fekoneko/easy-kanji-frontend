import { Link } from 'react-router-dom';
import EditUserForm from '../components/forms/EditUserForm';
import TitledPage from '../components/routing/TitledPage';

const EditUserPage = () => {
  return (
    <TitledPage title="Редактирование профиля">
      <div className="scrollContent">
        <h1 className="pageTitle">Редактирование профиля</h1>
        <EditUserForm />
        <Link to="/user" style={{ alignSelf: 'flex-end' }}>
          Вернуться к профилю
        </Link>
      </div>
    </TitledPage>
  );
};
export default EditUserPage;
