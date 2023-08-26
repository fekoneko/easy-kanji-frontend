import { Trans } from 'react-i18next';
import { Status } from '../../hooks/useLoading';
import LoadingSpinner from '../animations/LoadingSpinner';
import { ReactNode } from 'react';

type LoadingPlaceholderPRops = {
  status?: Status | null;
  children?: ReactNode;
};

const Loading = ({ status, children }: LoadingPlaceholderPRops) => {
  return status === undefined || status === 'pending' ? (
    <div className="content-placeholder">
      <LoadingSpinner />
    </div>
  ) : status === 'error' ? (
    <div className="content-placeholder">
      <Trans i18nKey="Pages.ErrorPlaceholder" components={{ p: <p /> }} />
    </div>
  ) : (
    <>{children}</>
  );
};
export default Loading;
