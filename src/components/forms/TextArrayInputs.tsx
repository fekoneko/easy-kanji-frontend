import { Dispatch, SetStateAction } from 'react';

type ArrayInputsProps = {
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  name?: string;
  ids?: string;
  placeholder?: string;
};

const TextArrayInputs = ({ array, setArray, name, ids, placeholder }: ArrayInputsProps) => {
  const handleAddElement = () => {
    setArray((prev) => [...prev, '']);
  };

  const handleRemoveElement = () => {
    setArray((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  const handleEditElement = (index: number, value: string) => {
    setArray((prev) => prev.fill(value, index));
  };

  return (
    <fieldset className="arrayInputs">
      {name ? <label htmlFor={ids}>{`${name}:`}</label> : <></>}
      <fieldset id={ids}>
        {array.map((item, index) => (
          <fieldset key={index}>
            {name ? (
              <label
                htmlFor={ids ? `${ids}${index}` : undefined}
                style={{ position: 'absolute', left: '-99999px' }}
              >{`${name} (${index}):`}</label>
            ) : (
              <></>
            )}
            <input
              id={ids ? `${ids}${index}` : undefined}
              type="text"
              placeholder={placeholder}
              onChange={(e) => handleEditElement(index, e.target.value)}
            />
          </fieldset>
        ))}
        <fieldset className="arrayInputButtons">
          <button type="button" onClick={handleAddElement}>
            Добавить
          </button>
          <button type="button" onClick={handleRemoveElement}>
            Удалить
          </button>
        </fieldset>
      </fieldset>
    </fieldset>
  );
};
export default TextArrayInputs;
