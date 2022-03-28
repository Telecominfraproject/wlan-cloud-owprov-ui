export default (toRun, timeout = 1000) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      toRun.apply(this, args);
    }, timeout);
  };
};
