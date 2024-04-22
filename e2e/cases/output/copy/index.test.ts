import { join } from 'node:path';
import { build } from '@e2e/helper';
import { expect, test } from '@playwright/test';
import { fse } from '@rsbuild/shared';

test('should copy asset to dist folder correctly', async () => {
  await build({
    cwd: __dirname,
    rsbuildConfig: {
      output: {
        distPath: {
          root: 'dist-1',
        },
        copy: [{ from: '../../../assets', to: '' }],
      },
    },
  });

  expect(fse.existsSync(join(__dirname, 'dist-1/icon.png'))).toBeTruthy();
});
