import fs from 'node:fs';
import { join, resolve } from 'node:path';
import { build } from '@e2e/helper';
import { expect, test } from '@playwright/test';

const fixtures = __dirname;

const generatorTempDir = async (testDir: string) => {
  fs.rmSync(testDir, { recursive: true, force: true });
  await fs.promises.cp(join(fixtures, 'src'), testDir, { recursive: true });

  return () => fs.promises.rm(testDir, { force: true, recursive: true });
};

test('generator TS declaration for namedExport true', async () => {
  const testDir = join(fixtures, 'test-temp-src-1');
  const clear = await generatorTempDir(testDir);

  await build({
    cwd: __dirname,
    rsbuildConfig: {
      source: {
        entry: { index: resolve(testDir, 'index.js') },
      },
    },
  });

  expect(fs.existsSync(join(testDir, './a.css.d.ts'))).toBeFalsy();
  expect(fs.existsSync(join(testDir, './b.module.scss.d.ts'))).toBeTruthy();
  expect(fs.existsSync(join(testDir, './c.module.less.d.ts'))).toBeTruthy();
  expect(fs.existsSync(join(testDir, './d.global.less.d.ts'))).toBeFalsy();

  const bContent = fs.readFileSync(join(testDir, './b.module.scss.d.ts'), {
    encoding: 'utf-8',
  });

  expect(bContent).toEqual(`// This file is automatically generated.
// Please do not change this file!
export const _default: string;
export const _underline: string;
export const btn: string;
export const primary: string;
export const theBClass: string;
export const underline: string;
`);

  const cContent = fs.readFileSync(join(testDir, './c.module.less.d.ts'), {
    encoding: 'utf-8',
  });

  expect(cContent).toEqual(`// This file is automatically generated.
// Please do not change this file!
export const theCClass: string;
`);

  await clear();
});

test('generator TS declaration for namedExport true and `asIs` convention', async () => {
  const testDir = join(fixtures, 'test-temp-src-4');
  const clear = await generatorTempDir(testDir);

  await build({
    cwd: __dirname,
    rsbuildConfig: {
      source: {
        entry: { index: resolve(testDir, 'index.js') },
      },
      output: {
        cssModules: {
          exportLocalsConvention: 'asIs',
        },
      },
    },
  });

  expect(fs.existsSync(join(testDir, './b.module.scss.d.ts'))).toBeTruthy();
  expect(fs.existsSync(join(testDir, './c.module.less.d.ts'))).toBeTruthy();

  const bContent = fs.readFileSync(join(testDir, './b.module.scss.d.ts'), {
    encoding: 'utf-8',
  });
  const cContent = fs.readFileSync(join(testDir, './c.module.less.d.ts'), {
    encoding: 'utf-8',
  });

  expect(bContent).toEqual(`// This file is automatically generated.
// Please do not change this file!
export const _default: string;
export const _underline: string;
export const btn: string;
export const primary: string;
export const theBClass: string;
`);

  expect(cContent).toEqual(`// This file is automatically generated.
// Please do not change this file!
export const theCClass: string;
`);

  await clear();
});
