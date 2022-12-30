import * as os from 'os';
import * as child_process from 'child_process';
import * as https from 'https';
import * as fs from 'fs';
import * as logger from 'pino';

import { IPowershellInstaller } from './installer';

export class DebianPowershellInstaller implements IPowershellInstaller {
  public canHandle(): boolean {
    try {
      if (os.type() !== 'Linux') {
        logger.default().info('[DebianInstaller] Not a linux system, passing...');
        return false;
      }

      const distributionName = this.getDistributionName();

      if (distributionName === 'Debian') {
        logger.default().info(`[DebianInstaller]: Found distribution ${distributionName}, handling installation`);
        return true;
      }

      logger.default().info('[DebianInstaller]: Debian distribution not found, passing...');
      return false;
    } catch (error) {
      logger.default().error('[Debian Installer] Issue during system detection, passing...');
      logger.default().error(`[Debian Installer] ${error}`);
      return false;
    }
  }

  public async install(): Promise<unknown> {
    if (!this.canHandle()) {
      return Promise.reject(false);
    }

    if (this.isInstalled()) {
      return Promise.resolve(true);
    }

    this.installDependencies();
  }

  private getDistributionName(): string {
    const linuxRelease = child_process.execSync('lsb_release -a', { encoding: 'utf8', stdio: 'pipe' });
    const distributorLine = linuxRelease.split('\n')[0];

    const distribution = distributorLine.match(/Distributor ID:\s*(.*)/);

    if (distribution) {
      return distribution[1];
    }

    throw Error('Cannot find distribution name');
  }

  private isInstalled(): boolean {
    try {
      child_process.execSync('dpkg -s powershell', { encoding: 'utf8', stdio: 'pipe' });
      logger.default().info('[DebianInstaller]: Powershell is already installed');
      return true;
    } catch (error) {
      logger.default().info('[DebianInstaller]: Powershell is not installed');
      return false;
    }
  }

  private async installDependencies() {
    logger.default().info('[DebianInstaller]: Installing dependencies');
    child_process.spawnSync('sudo', ['apt-get', 'update']);
    child_process.spawnSync('sudo', ['apt-get', 'install', 'apt-transport-https']);

    const release = child_process.execSync('lsb_release -rs');

    const keyFilePath = fs.createWriteStream('packages-microsoft-prod.deb');

    await new Promise((resolve, _) => {
      https.get(`https://packages.microsoft.com/config/debian/${release}/packages-microsoft-prod.deb`, (r) => {
        r.pipe(keyFilePath);
        resolve(null);
      });
    });

    child_process.spawnSync('sudo', ['dpkg', '-i', 'packages-microsoft-prod.deb']);
    child_process.spawnSync('sudo', ['apt-get', 'update']);
    child_process.spawnSync('sudo', ['apt-get', 'install', '-y', 'powershell']);

    child_process.execSync('rm packages-microsoft-prod.deb');
  }
}
