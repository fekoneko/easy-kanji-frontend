import { Dispatch, SetStateAction, useRef } from 'react';
import useWanaKana from '../../hooks/useWanaKana';
import Info from '../content/Info';
import { Trans, useTranslation } from 'react-i18next';

type SearchBarProps = {
  searchRequest: string;
  setSearchRequest: Dispatch<SetStateAction<string>>;
};

const SearchBar = ({ searchRequest, setSearchRequest }: SearchBarProps) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  useWanaKana(searchInputRef);

  return (
    <form className="mb-3 flex gap-4" ref={searchFormRef} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="search" style={{ position: 'absolute', left: '-99999px' }}>
        {t('Forms.SearchBar.Search')}
      </label>
      <input
        ref={searchInputRef}
        id="search"
        autoFocus
        role="search"
        type="text"
        placeholder={t('Forms.SearchBar.SearchPlaceholder')}
        value={searchRequest}
        onInput={
          (e: any) => typeof e.target.value === 'string' && setSearchRequest(e.target.value)
          // Need to use onInput for correct value updating when using Wanakana
        }
        aria-describedby="searchHint"
        className="flex-grow"
      />

      <Info tooltipId="searchHint" tooltipAnchorRef={searchFormRef}>
        <Trans
          i18nKey="Pages.Search.Info"
          components={{ p: <p />, ul: <ul />, li: <li />, key: <span className="key" /> }}
        />
      </Info>
    </form>
  );
};
export default SearchBar;
