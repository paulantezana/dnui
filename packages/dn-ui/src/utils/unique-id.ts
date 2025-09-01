const uniqueId = (length: number = 6): number => {
  const timestamp: number = Date.now();

  const _getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const ts: string = timestamp.toString();
  const parts: string[] = ts.split("").reverse();
  let id: string = "";

  for (let i = 0; i < length; ++i) {
    const index: number = _getRandomInt(0, parts.length - 1);
    id += parts[index];
  }

  return parseInt(`1${id}`);
};

export default uniqueId;
