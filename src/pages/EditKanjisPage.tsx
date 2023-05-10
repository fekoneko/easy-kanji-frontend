import { useRef } from 'react';
import Info from '../components/content/Info';
import EditKanjisUI from '../components/layout/EditKanjisUI';

const EditKanjisPage = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="onScreenContent">
      <div className="pageTitle" ref={titleRef}>
        <h1>Редактирование кандзи</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <p>Добро пожаловать в панель администратора!</p>
          <p> Здесь Вы можете добавлять, изменять и удалять кандзи.</p>

          <ul>
            <li>
              <p>
                Выделите необходимый кандзи для изменения в левом меню – информация о нём появится
                справа
              </p>
            </li>

            <li>
              <p>Если Вы хотите создать новый кандзи, снимите выделение с кандзи в левом меню</p>
            </li>

            <li>
              <p>Удалить кандзи можно нажав на иконку корзины в левом меню</p>
            </li>
          </ul>
        </Info>
      </div>

      <EditKanjisUI />
    </div>
  );
};
export default EditKanjisPage;
