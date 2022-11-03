import { Compiler, WebpackPluginInstance } from 'webpack';

type Condition = (compiler: Compiler) => boolean;

class WebpackConditionalPlugin {
  private condition: Condition;

  private plugin: WebpackPluginInstance;

  constructor(condition: Condition, plugin: WebpackPluginInstance) {
    this.condition = condition;
    this.plugin = plugin;
  }

  public apply(compiler: Compiler): void {
    if (this.condition(compiler)) {
      this.plugin.apply(compiler);
    }
  }
}

export default WebpackConditionalPlugin;
