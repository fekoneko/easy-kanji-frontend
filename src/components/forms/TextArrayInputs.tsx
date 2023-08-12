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
    <>
      {name ? <label htmlFor={ids}>{`${name}:`}</label> : <></>}

      <div className="flex flex-col items-center gap-2">
        <div id={ids} className="flex flex-1 flex-wrap gap-2">
          {array.map((item, index) => (
            <div key={index} className="w-[calc(50%-0.25rem)] min-w-[5rem] flex-grow">
              {name ? (
                <label
                  htmlFor={ids ? `${ids}${index}` : undefined}
                  className="absolute left-[-99999px]"
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
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddElement}
            className="h-8 w-8 rounded-sm border-2 border-dark-gray  hover:bg-black hover:bg-opacity-10 dark:border-gray dark:hover:bg-soft-white dark:hover:bg-opacity-10"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleRemoveElement}
            className="h-8 w-8 rounded-sm border-2 border-dark-gray  hover:bg-black hover:bg-opacity-10 dark:border-gray dark:hover:bg-soft-white dark:hover:bg-opacity-10"
          >
            -
          </button>
        </div>
      </div>
    </>
  );
};
export default TextArrayInputs;
