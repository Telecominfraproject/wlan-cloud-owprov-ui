export default (toRun: (e: unknown) => void, timeout = 1000) => {
  let timer: NodeJS.Timeout;
  // @ts-ignore
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      toRun.apply(this, args);
    }, timeout);
  };
};
