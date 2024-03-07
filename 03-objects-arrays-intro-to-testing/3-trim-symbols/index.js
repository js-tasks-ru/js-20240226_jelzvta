/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const removeDuplicates = (string, size) => {
    let counter = 1;
    const stringCollection = string.split('');
    let trimmedArray = [stringCollection[0]];
    for (let i = 1; i < stringCollection.length; i++) {
      if (stringCollection[i] !== stringCollection[i - 1]) {
        counter = 1;
        trimmedArray.push(stringCollection[i]);
      } else {
        counter++;
        if (counter <= size) {
          trimmedArray.push(stringCollection[i]);
        }
      }
    }
    return trimmedArray.join('');
  }

  return size === 0 ? '' : !size ? string : removeDuplicates(string, size);
  }
