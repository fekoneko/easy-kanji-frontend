import { FormEvent, useEffect, useRef, useState } from 'react';
import feedbackApi from '../../api/feedbackApi';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import usePopup from '../../hooks/usePopup';
import { useTranslation } from 'react-i18next';

const FeedbackForm = () => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { showPopup } = usePopup();
  const [feedbackBody, setFeedbackBody] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackAnonimus, setFeedbackAnonimus] = useState(false);
  const [sendErrorStatus, setSendErrorStatus] = useState<number | null>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSendErrorStatus(null);
  }, [feedbackBody, feedbackEmail, feedbackAnonimus, auth?.username]);

  useEffect(() => {
    if (sendErrorStatus) showPopup(t('Forms.Feedback.Errors.SendFailed'));
  }, [sendErrorStatus]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    feedbackApi.send(
      feedbackBody,
      !feedbackAnonimus ? auth?.username : undefined,
      !feedbackAnonimus ? feedbackEmail : undefined,
      setSendErrorStatus
    );
    navigate('/popular');
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="feedbackBody">{t('Forms.Feedback.Body')}</label>
        <textarea
          autoFocus
          required
          id="feedbackBody"
          placeholder={t('Forms.Feedback.BodyPlaceholder')}
          value={feedbackBody}
          onChange={(e) => setFeedbackBody(e.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="feedbackEmail" aria-disabled={feedbackAnonimus}>
          {t('Forms.Feedback.Email')}
        </label>
        <input
          id="feedbackEmail"
          type="email"
          placeholder={t('Forms.Feedback.EmailPlaceholder')}
          value={feedbackEmail}
          onChange={(e) => setFeedbackEmail(e.target.value)}
          disabled={feedbackAnonimus}
        />
      </fieldset>

      <fieldset>
        <input
          id="feedbackAnonimus"
          type="checkbox"
          title={t('Forms.Feedback.AnonimusTooltip')}
          checked={feedbackAnonimus}
          onChange={(e) => setFeedbackAnonimus(e.target.checked)}
        />
        <label htmlFor="feedbackAnonimus">{t('Forms.Feedback.Anonimus')}</label>
      </fieldset>

      <button ref={submitRef} type="submit">
        {t('Forms.Feedback.Send')}
      </button>
    </form>
  );
};
export default FeedbackForm;
