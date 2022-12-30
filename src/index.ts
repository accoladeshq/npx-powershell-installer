import { PowershellInstaller } from './installers/installer';

const installer = new PowershellInstaller();

installer.canHandle();
installer.install();