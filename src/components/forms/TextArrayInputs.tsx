import { Dispatch, SetStateAction } from 'react';

type ArrayInputsProps = {
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  name?: string;
  ids?: string;
  placeholder?: string;
};

const TextArrayInputs = ({ array, setArray, name, ids, placeholder }: ArrayInputsProps) => {
  const handleAddElement = () => setArray((prev) => [...prev, '']);

  const handleRemoveElement = () =>
    setArray((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));

  const handleEditElement = (index: number, item: string) =>
    setArray((prev) => {
      const newArray = [...prev];
      newArray[index] = item;
      return newArray;
    });

  return (
    <fieldset className="arrayInputsContainer">
      {name ? <label htmlFor={ids}>{`${name}:`}</label> : <></>}

      <div>
        <div id={ids} className="arrayInputs">
          {array.map((item, index) => (
            <div key={index}>
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
                value={item}
                onChange={(e) => handleEditElement(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="arrayInputsButtons">
          <button type="button" onClick={handleAddElement}>
            +
          </button>
          <button type="button" onClick={handleRemoveElement}>
            -
          </button>
        </div>
      </div>
    </fieldset>
  );
};
export default TextArrayInputs;
