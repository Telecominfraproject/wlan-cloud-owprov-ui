export default (toRun: () => void, timeout: number = 1000) => {
  let timer: any;
  // @ts-ignore
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      toRun.apply(this, args);
    }, timeout);
  };
};
