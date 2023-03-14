const SearchBar = () => {
  return (
    <form>
      <label htmlFor="search" style={{ position: 'absolute', left: '-99999px' }}>
        Поиск:
      </label>
      <input id="search" autoFocus role="search" type="text" placeholder="Поиск кандзи" />
    </form>
  );
};
export default SearchBar;
