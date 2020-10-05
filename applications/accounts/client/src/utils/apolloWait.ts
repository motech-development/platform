// TODO: Remove to shared Apollo lib
const apolloWait = async (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export default apolloWait;
