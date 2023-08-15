import { useContext } from 'react';
import settingsContext from '../../contexts/settingsContext';
import { useTranslation } from 'react-i18next';

type LanguageSwitchProps = {
  mini?: boolean;
};

const LanguageSwitch = ({ mini }: LanguageSwitchProps) => {
  const { t } = useTranslation();
  const { setLanguage } = useContext(settingsContext);

  const handleLanguageSwitch = () => {
    setLanguage((prev) => (prev === 'ru' ? 'ja' : 'ru'));
  };

  return (
    <button onClick={handleLanguageSwitch}>
      {mini ? t('Settings.LanguageMini') : t('Settings.Language')}
    </button>
  );
};
export default LanguageSwitch;
