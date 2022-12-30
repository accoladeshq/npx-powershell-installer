import { DebianPowershellInstaller } from './debian-installer';
import { WindowsPowershellInstaller } from './windows-installer';

export interface IPowershellInstaller {
  /**
   * Check if this installer can handle the installation process.
   */
  canHandle(): boolean;

  install(): Promise<unknown>;
}

export class PowershellInstaller implements IPowershellInstaller {
  private _installers: IPowershellInstaller[];

  constructor() {
    this._installers = [];
    this._installers.push(new DebianPowershellInstaller());
    this._installers.push(new WindowsPowershellInstaller());
  }

  public canHandle(): boolean {
    let found: boolean = false;

    this._installers.forEach((installer) => {
      if (installer.canHandle()) {
        found = true;
        return;
      }
    });

    return found;
  }

  public install(): Promise<unknown> {
    let installer: IPowershellInstaller | undefined;

    this._installers.forEach((i) => {
      if (i.canHandle()) {
        installer = i;
        return;
      }
    });

    if (installer === undefined) {
      throw Error('No installer found');
    }

    return installer.install();
  }
}
