import { DebianPowershellInstaller } from '../../src/installers/debian-installer';

/**
 * @group integration/debian
 */

describe('DebianInstaller', () => {
  let installer: DebianPowershellInstaller;

  beforeAll(() => {
    installer = new DebianPowershellInstaller();
  });

  it('shoud handle installation on debian', () => {
    const canHandle = installer.canHandle();
    expect(canHandle).toBeTruthy();
  });
});
