import * as os from 'os';
import * as child_process from 'child_process';
import * as fs from 'fs';
import request from 'request';

import { IPowershellInstaller } from './installer';

export class WindowsPowershellInstaller implements IPowershellInstaller {
  canHandle(): boolean {
    return os.platform() === 'win32';
  }

  public async install(): Promise<unknown> {

    try {
      child_process.execSync('where pwsh');
      return;
    } catch (error) {
      console.log('bim')
    }

    const keyFilePath = fs.createWriteStream('PowerShell-7.3.0-win-x64.msi');

    console.log('bam')
    await new Promise((resolve,) => {
      request(
        `https://github.com/PowerShell/PowerShell/releases/download/v7.3.0/PowerShell-7.3.0-win-x64.msi`, { followRedirect: true }).pipe(keyFilePath).on('close', () => resolve(null));
    });

    console.log('outch')

    child_process.execSync('msiexec /i "PowerShell-7.3.0-win-x64.msi" /qn')

    return Promise.resolve();
  }
}
