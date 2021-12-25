import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  log(message: string) {
    super.log(message);
  }
  error(message: string, trace: string) {
    console.log('error', message, trace);
    // super.error.apply(message, trace);
  }
  warn(message: string) {
    super.warn(message);
  }
  debug(message: string) {
    super.debug(message);
  }
  verbose(message: string) {
    super.verbose(message);
  }
}
