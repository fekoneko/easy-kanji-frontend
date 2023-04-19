import { FormEvent, useRef, useState } from 'react';
import feedbackApi from '../../api/feedbackApi';
import useAuth from '../../hooks/useAuth';
import Tooltip from '../content/Tooltip';

const FeedbackForm = () => {
  const { auth } = useAuth();
  const [feedbackBody, setFeedbackBody] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackAnonimus, setFeedbackAnonimus] = useState(false);
  const [sendErrorStatus, setSendErrorStatus] = useState<number | null>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    feedbackApi.send(
      feedbackBody,
      !feedbackAnonimus ? auth?.username : undefined,
      !feedbackAnonimus ? feedbackEmail : undefined,
      setSendErrorStatus
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="feedbackBody">Отзыв:</label>
        <textarea
          autoFocus
          required
          id="feedbackBody"
          placeholder="Напишите, что вы думаете о сайте или предложите свою идею"
          value={feedbackBody}
          onChange={(e) => setFeedbackBody(e.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="feedbackEmail">Email:</label>
        <input
          id="feedbackEmail"
          type="email"
          placeholder="Как с вами связаться?"
          value={feedbackEmail}
          onChange={(e) => setFeedbackEmail(e.target.value)}
        />
      </fieldset>

      <fieldset>
        <input
          id="feedbackContacts"
          type="checkbox"
          title="Вы можете скрыть свой логин и контакты"
          checked={feedbackAnonimus}
          onChange={(e) => setFeedbackAnonimus(e.target.checked)}
        />
        <label htmlFor="feedbackContacts">Остаться анонимным</label>
      </fieldset>

      <button ref={submitRef} type="submit">
        Отправить
      </button>
      <Tooltip shown={!!sendErrorStatus} anchorRef={submitRef}>
        Ошибка отправки
      </Tooltip>
    </form>
  );
};
export default FeedbackForm;
