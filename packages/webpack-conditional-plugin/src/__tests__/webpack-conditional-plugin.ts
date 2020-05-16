import { Compiler } from 'webpack';
import ConditionalPlugin from '../webpack-conditional-plugin';

class MockPlugin {
  public apply: jest.Mock;

  constructor(apply: jest.Mock) {
    this.apply = apply;
  }
}

describe('webpack-conditional-plugin', () => {
  let apply: jest.Mock;
  let compiler: Compiler;

  beforeEach(() => {
    apply = jest.fn();
    compiler = {} as Compiler;
  });

  it('should trigger the plugin if the condition is met', () => {
    const plugin = new ConditionalPlugin(() => true, new MockPlugin(apply));

    plugin.apply(compiler);

    expect(apply).toHaveBeenCalled();
  });

  it('should not trigger the plugin if the condition is not met', () => {
    const plugin = new ConditionalPlugin(() => false, new MockPlugin(apply));

    plugin.apply(compiler);

    expect(apply).not.toHaveBeenCalled();
  });
});
