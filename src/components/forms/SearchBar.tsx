import { Dispatch, SetStateAction, useRef } from 'react';
import useWanaKana from '../../hooks/useWanaKana';
import Info from '../content/Info';

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

      <Info tooltipId="searchHint" tooltipAnchorRef={searchFormRef}>
        <ul>
          <li>
            <p>
              Несколько запросов разделяются запятыми <span className="key">,</span>
              <span className="key">、</span> или широким пробелом <span className="key">　</span>
            </p>
          </li>

          <li>
            <p>
              Поддерживается автоматический перевод ромадзи в кану{' '}
              <span className="key">hiragana</span>→<span className="key">ひらがな</span>{' '}
              <span className="key">KATAKANA</span>→<span className="key">カタカナ</span>
            </p>
          </li>
        </ul>
      </Info>
    </form>
  );
};
export default SearchBar;
