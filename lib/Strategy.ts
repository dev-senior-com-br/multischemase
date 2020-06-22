/**
 * The Strategy interface declares operations common to all supported versions
 * of database migration tools.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
interface Strategy {

  exec(cmd: string, configFolder: string, configFile: string): void;

  getSchemaName(): string;
}
export = Strategy;