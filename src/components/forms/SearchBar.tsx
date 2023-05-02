import { Dispatch, SetStateAction, useRef } from 'react';
import useWanaKana from '../../hooks/useWanaKana';
import InfoHover from '../content/InfoHover';

type SearchBarProps = {
  searchRequest: string;
  setSearchRequest: Dispatch<SetStateAction<string>>;
};

const SearchBar = ({ searchRequest, setSearchRequest }: SearchBarProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  useWanaKana(searchInputRef);

  return (
    <form className="searchForm" ref={searchFormRef} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="search" style={{ position: 'absolute', left: '-99999px' }}>
        Поиск:
      </label>
      <input
        ref={searchInputRef}
        id="search"
        autoFocus
        role="search"
        type="text"
        placeholder="Введите кандзи, его чтение или значение"
        value={searchRequest}
        onInput={
          (e: any) => typeof e.target.value === 'string' && setSearchRequest(e.target.value)
          // Need to use onInput for correct value updating when using Wanakana
        }
        aria-describedby="searchHint"
      />
      <InfoHover tooltipId="searchHint" tooltipAnchorRef={searchFormRef}>
        Несколько запросов разделяются запятой или широким пробелом.
        <br />
        Поддерживается автоматический перевод ромадзи в кану (нижний регистр - хирагана, ВЕРХНИЙ
        регистр - катакана)
      </InfoHover>
    </form>
  );
};
export default SearchBar;
