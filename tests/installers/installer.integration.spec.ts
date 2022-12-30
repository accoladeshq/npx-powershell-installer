import { IPowershellInstaller, PowershellInstaller } from '../../src/installers/installer';

/**
 * @group integration/debian
 * @group integration/windows
 */

describe('Installer', () => {
  let installer: IPowershellInstaller;

  beforeAll(() => {
    installer = new PowershellInstaller();
  });

  it('shoud handle installation on debian', () => {
    if(!process.env.JEST_GROUP_INTEGRATION_DEBIAN){
        return;
    }

    const canHandle = installer.canHandle();
    expect(canHandle).toBeTruthy();
  });

  it('should handle installation on Windows', () => {
    if(!process.env.JEST_GROUP_INTEGRATION_WINDOWS){
        return;
    }

    const canHandle = installer.canHandle();
    expect(canHandle).toBeTruthy();
  });
});
