import { WindowsPowershellInstaller } from '../../src/installers/windows-installer';

/**
 * @group integration/windows
 */

describe('WindowsInstaller', () => {
  let installer: WindowsPowershellInstaller;

  beforeAll(() => {
    installer = new WindowsPowershellInstaller();
  });

  it('shoud handle installation on windows', () => {
    const canHandle = installer.canHandle();
    expect(canHandle).toBeTruthy();
  });
});
