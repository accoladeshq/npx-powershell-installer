import * as os from 'os';

import { IPowershellInstaller } from './installer';

export class WindowsPowershellInstaller implements IPowershellInstaller {
  canHandle(): boolean {
    return os.platform() === 'win32';
  }

  install(): Promise<unknown> {
    return Promise.resolve();
  }
}
