#!/usr/bin/env node
// Deep-merges locales/en.json into every other locale: missing keys get the English
// value, keys absent from en.json are removed, existing translations are preserved.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'locales');
const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

function sync(base, target) {
  const out = {};
  for (const key of Object.keys(base)) {
    if (isObj(base[key])) out[key] = sync(base[key], isObj(target && target[key]) ? target[key] : {});
    else out[key] = target && typeof target[key] === 'string' ? target[key] : base[key];
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(path.join(dir, 'en.json'), 'utf8'));
for (const lang of ['ar', 'ur', 'id', 'tr']) {
  const file = path.join(dir, `${lang}.json`);
  const current = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  fs.writeFileSync(file, JSON.stringify(sync(en, current), null, 2) + '\n');
}
