const PopperJs =
  jest.requireActual<{
    placements: unknown;
  }>('popper.js');

const Popper = {
  destroy: () => {},
  placements: PopperJs.placements,
  scheduleUpdate: () => {},
};

export default Popper;
