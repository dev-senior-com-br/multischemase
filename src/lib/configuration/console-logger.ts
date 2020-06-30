/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Logger } from './logger.type';


export class ConsoleLogger implements Logger {
  debug(message: any): void {
    console.debug(message);
  }
  error(message: any): void {
    console.debug(message);
  }
  info(message: any): void {
    console.debug(message);
  }
}