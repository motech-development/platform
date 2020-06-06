const delay = async (timeout: number) =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

export default delay;
