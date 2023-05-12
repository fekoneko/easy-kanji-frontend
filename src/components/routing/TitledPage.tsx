import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

type PageTitleProps = {
  title: string;
  children: ReactNode;
};

const TitledPage = ({ title, children }: PageTitleProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>
          {title} – {t('SiteTitle')}
        </title>
      </Helmet>
      {children}
    </>
  );
};
export default TitledPage;
