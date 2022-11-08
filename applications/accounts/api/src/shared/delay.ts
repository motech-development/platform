const delay = async (timeout: number): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

export default delay;
