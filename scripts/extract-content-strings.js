// Extracts every translatable English string from content/*.ts into content/i18n/en.json.
// Run: npm run i18n:extract   (uses tsx to import the TypeScript content modules)
// Arabic text, transliteration and source refs are never extracted: they are not translated.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { DAYS, WEEKS } = require(path.join(root, 'content/days.ts'));
const { DUA_CATEGORIES } = require(path.join(root, 'content/duas.ts'));
const learn = require(path.join(root, 'content/learn.ts'));
const { MILESTONE_CONTENT, WELCOME_BACK } = require(path.join(root, 'content/milestones.ts'));

const out = {};
function put(key, value) {
  if (typeof value !== 'string' || value === '') return;
  if (key in out && out[key] !== value) throw new Error(`Conflicting English for key ${key}`);
  out[key] = value;
}

for (const w of WEEKS) put(`week.${w.week}.title`, w.title);

for (const d of DAYS) {
  const p = `day.${d.day}`;
  put(`${p}.theme`, d.theme);
  put(`${p}.intro`, d.intro);
  put(`${p}.reflection`, d.reflection);
  put(`${p}.quran.note`, d.quran.note);
  put(`${p}.prayer.tip`, d.prayerFocus.tip);
  if (d.prayerFocus.dua) put(`${p}.prayer.dua.meaning`, d.prayerFocus.dua.meaning);
  put(`${p}.sunnah.title`, d.sunnah.title);
  put(`${p}.sunnah.description`, d.sunnah.description);
  put(`${p}.character.trait`, d.character.trait);
  put(`${p}.character.description`, d.character.description);
  put(`${p}.character.action`, d.character.action);
  put(`${p}.hadith.meaning`, d.hadith.meaning);
  for (const t of d.tasks) {
    put(`${p}.task.${t.id}.title`, t.title);
    put(`${p}.task.${t.id}.titleBeginner`, t.titleBeginner);
    put(`${p}.task.${t.id}.titleAdvanced`, t.titleAdvanced);
  }
  for (const z of [...d.morningDhikr, ...d.eveningDhikr]) put(`${p}.dhikr.${z.id}.meaning`, z.meaning);
}

for (const c of DUA_CATEGORIES) {
  put(`duaCat.${c.id}.title`, c.title);
  for (const u of c.duas) {
    put(`dua.${u.id}.title`, u.title);
    put(`dua.${u.id}.occasion`, u.occasion);
    put(`dua.${u.id}.meaning`, u.text.meaning);
  }
}

for (const name of ['WUDU_STEPS', 'SALAH_STEPS']) {
  const list = name.toLowerCase();
  for (const s of learn[name]) {
    put(`learn.${list}.${s.id}.title`, s.title);
    put(`learn.${list}.${s.id}.body`, s.body);
    if (s.recite) put(`learn.${list}.${s.id}.recite.meaning`, s.recite.meaning);
  }
}
put('learn.dua_after_wudu.meaning', learn.DUA_AFTER_WUDU.meaning);
for (const n of learn.SALAH_NOTES) {
  put(`learn.salah_notes.${n.id}.title`, n.title);
  put(`learn.salah_notes.${n.id}.body`, n.body);
}
for (const [list, arr] of [['pillar', [...learn.PILLARS_OF_ISLAM, ...learn.PILLARS_OF_IMAN]]]) {
  for (const p of arr) {
    put(`learn.${list}.${p.id}.name`, p.name);
    put(`learn.${list}.${p.id}.meaning`, p.meaning);
  }
}
for (const [list, arr] of [
  ['morning_adhkar', learn.MORNING_ADHKAR],
  ['evening_adhkar', learn.EVENING_ADHKAR],
]) {
  for (const z of arr) put(`learn.${list}.${z.id}.meaning`, z.meaning);
}

for (const [id, m] of Object.entries(MILESTONE_CONTENT)) {
  put(`milestone.${id}.title`, m.title);
  put(`milestone.${id}.meaning`, m.text.meaning);
}
put('welcomeBack.meaning', WELCOME_BACK.meaning);

const sorted = {};
for (const k of Object.keys(out).sort()) sorted[k] = out[k];
const dest = path.join(root, 'content/i18n/en.json');
fs.writeFileSync(dest, JSON.stringify(sorted, null, 2) + '\n');
console.log(`Wrote ${Object.keys(sorted).length} keys to content/i18n/en.json`);
