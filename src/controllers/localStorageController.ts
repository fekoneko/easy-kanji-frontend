export const getFromLocalStorage = <T>(key: string): T | null => {
  const valueJson = localStorage.getItem(key);
  if (!valueJson) return null;
  let value: T;
  try {
    value = JSON.parse(valueJson);
    return value;
  } catch {
    return null;
  }
};

export const setInLocalStorage = <T>(key: string, value: T): void => {
  let valueJson: string;
  try {
    valueJson = JSON.stringify(value);
  } catch {
    return;
  }
  localStorage.setItem(key, valueJson);
};
