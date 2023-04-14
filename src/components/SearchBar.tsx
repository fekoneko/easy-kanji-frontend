import { Dispatch, SetStateAction } from 'react';

type SearchBarProps = {
  searchRequest: string;
  setSearchRequest: Dispatch<SetStateAction<string>>;
};

const SearchBar = ({ searchRequest, setSearchRequest }: SearchBarProps) => {
  return (
    <form>
      <label htmlFor="search" style={{ position: 'absolute', left: '-99999px' }}>
        Поиск:
      </label>
      <input
        id="search"
        autoFocus
        role="search"
        type="text"
        placeholder="Введите кандзи, его чтение или значение"
        value={searchRequest}
        onChange={(e) => setSearchRequest(e.target.value)}
      />
    </form>
  );
};
export default SearchBar;
