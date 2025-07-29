/** @jest-environment jsdom */
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

const ts = 12345;

beforeAll(() => {
  try {
    fs.symlinkSync(path.resolve('frontend/pages'), '/pages');
  } catch (err) {
    // ignore if already exists
  }
});

beforeEach(() => {
  jest.resetModules();
  document.body.innerHTML = '<div id="app"></div>';
  localStorage.clear();
  sessionStorage.clear();
  global.fetch = jest.fn(async (url) => {
    if (url.endsWith('login.html')) {
      return { ok: true, text: async () => '<main id="page-content"><form id="login-form"></form></main>' };
    }
    if (url.endsWith('gameChooser.html')) {
      return { ok: true, text: async () => '<main id="page-content"><div id="game-chooser"></div></main>' };
    }
    return { ok: true, text: async () => '' };
  });
  jest.spyOn(Date, 'now').mockReturnValue(ts);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('navigate to gameChooser without token redirects to login page', async () => {
  jest.unstable_mockModule('/pages/Login/login.js', () => ({ default: () => {} }));
  jest.unstable_mockModule('/pages/GameChooser/gameChooser.js', () => ({ default: () => {} }));

  const { navigateTo } = await import('../../frontend/core/loadComponents.js');
  navigateTo('gameChooser');
  await new Promise(r => setTimeout(r, 0));

  expect(window.location.pathname).toBe('/login');
  expect(document.querySelector('#login-form')).not.toBeNull();
});

test('login then navigate to gameChooser loads the page', async () => {
  jest.unstable_mockModule('/pages/Login/login.js', () => ({ default: () => {} }));
  jest.unstable_mockModule('/pages/GameChooser/gameChooser.js', () => ({ default: () => {} }));
  jest.unstable_mockModule('../../frontend/services/httpService.js', () => ({
    httpPost: jest.fn(async () => ({ token: 't123' })),
    httpGet: jest.fn(),
    httpPut: jest.fn(),
    httpDelete: jest.fn()
  }));

  const { loginUser } = await import('../../frontend/services/api/userAPI.js');
  const { navigateTo } = await import('../../frontend/core/loadComponents.js');

  await loginUser('a@b.com', 'pw');
  navigateTo('gameChooser');
  await new Promise(r => setTimeout(r, 0));

  expect(localStorage.getItem('token')).toBe('t123');
  expect(window.location.pathname).toBe('/gameChooser');
  expect(document.querySelector('#game-chooser')).not.toBeNull();
});