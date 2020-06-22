import Strategy from "./Strategy";

/**
 * The Context defines the interface of interest to clients.
 */
export = class Context {
  /**
   * @type {Strategy} The Context maintains a reference to one of the Strategy
   * objects.
   */
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  public exec(cmd: string, configFolder: string, configFile: string) {
    this.strategy.exec(cmd, configFolder, configFile);
  }
};
