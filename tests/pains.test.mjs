import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the auto-scrolling pains band is gone from the home', () => {
  const tpl = read('index.html');
  assert.doesNotMatch(tpl, /pains-band|pains-track|pains-viewport|src\/pains\.mjs|pains-toggle/);
});

test('no leftover pains band styles remain', () => {
  const css = read('styles/landing.css');
  assert.doesNotMatch(css, /\.pains-band|\.pains-track|\.pains-viewport|@keyframes pains|animation: pains/);
});
