import { useRef } from 'react';
import Info from '../components/content/Info';
import EditKanjisUI from '../components/layout/EditKanjisUI';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';

const EditKanjisPage = () => {
  const { t } = useTranslation();
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <TitledPage title={t('Pages.EditKanjis.Title')}>
      <div className="mb-4 mt-7 flex items-center justify-between" ref={titleRef}>
        <h1>{t('Pages.EditKanjis.Title')}</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <Trans
            i18nKey="Pages.EditKanjis.Info"
            components={{ p: <p />, ul: <ul />, li: <li />, key: <span className="key" /> }}
          />
        </Info>
      </div>

      <EditKanjisUI />
    </TitledPage>
  );
};
export default EditKanjisPage;
