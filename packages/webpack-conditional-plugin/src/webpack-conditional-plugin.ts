import { Compiler, Plugin } from 'webpack';

type Condition = (compiler: Compiler) => boolean;

class WebpackConditionalPlugin {
  private condition: Condition;

  private plugin: Plugin;

  constructor(condition: Condition, plugin: Plugin) {
    this.condition = condition;
    this.plugin = plugin;
  }

  public apply(compiler: Compiler) {
    if (this.condition(compiler)) {
      this.plugin.apply(compiler);
    }
  }
}

export default WebpackConditionalPlugin;
