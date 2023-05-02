import { Link } from 'react-router-dom';
import EditUserForm from '../components/forms/EditUserForm';

const EditUserPage = () => {
  return (
    <div className="scrollContent">
      <h1>Редактирование профиля</h1>
      <EditUserForm />
      <Link to="/user" style={{ alignSelf: 'flex-end' }}>
        Вернуться к профилю
      </Link>
    </div>
  );
};
export default EditUserPage;
