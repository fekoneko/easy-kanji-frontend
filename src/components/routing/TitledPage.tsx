import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

type PageTitleProps = {
  title: string;
  children: ReactNode;
};

const TitledPage = ({ title, children }: PageTitleProps) => {
  return (
    <>
      <Helmet>
        <title>{title} – EasyKanji</title>
      </Helmet>
      {children}
    </>
  );
};
export default TitledPage;
