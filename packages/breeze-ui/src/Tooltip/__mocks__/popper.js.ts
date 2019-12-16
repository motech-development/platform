const PopperJs = jest.requireActual('popper.js');

export default class Popper {
  public static placements = PopperJs.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {},
    };
  }
}
