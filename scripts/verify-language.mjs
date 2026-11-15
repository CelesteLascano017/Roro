import assert from 'node:assert/strict';
import { SPANISH } from '../src/data/translations.js';
import { EVIDENCE_ITEMS, NOTE_CONTENT } from '../src/data/evidenceData.js';
import { ROOMS, HIDING_SPOTS, DISTRACTIONS } from '../src/data/apartmentData.js';
import { DIFFICULTY_SETTINGS } from '../src/data/gameConfig.js';
import { INTRODUCTION, INTERVIEWS, formatStoryText } from '../src/data/dialogueData.js';
import { getLanguage, setLanguage, t } from '../src/managers/LanguageManager.js';

const saved = new Map();
globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
globalThis.document = { documentElement: { lang: 'en' } };
setLanguage('es');
assert.equal(getLanguage(), 'es');
assert.equal(document.documentElement.lang, 'es');
assert.equal(t('Start'), 'Jugar');
assert.equal(t('HIDDEN {score} / {max}', { score: 0, max: 6 }), 'OCULTAS 0 / 6');
assert.equal(t('Carrying: {name}', { name: t('blue lamp') }), 'Llevas: lampara azul');
assert.equal(t('Unknown source'), 'Unknown source');
assert.throws(() => setLanguage('fr'), /Unsupported language/);
assert.equal(getLanguage(), 'es');
assert.equal((await import('../src/managers/LanguageManager.js?saved')).getLanguage(), 'es');

const content = [
    ...EVIDENCE_ITEMS.map(item => item.name),
    ...ROOMS.map(room => room.name),
    ...HIDING_SPOTS.map(spot => spot.name),
    ...DISTRACTIONS.flatMap(item => [item.prompt, item.noiseText]),
    ...Object.values(DIFFICULTY_SETTINGS).flatMap(item => [item.label, item.description]),
    ...INTRODUCTION.map(line => line.text),
    ...INTERVIEWS.flatMap(interview => [interview.title, ...interview.lines.map(line => line.text)]),
    NOTE_CONTENT.heading, NOTE_CONTENT.body, NOTE_CONTENT.footer
];
for (const source of content) assert.ok(Object.hasOwn(SPANISH, source), 'Missing translation: ' + source);
for (const [source, translation] of Object.entries(SPANISH)) {
    assert.ok(/^[\x00-\x7f]*$/.test(translation), 'Non-ASCII translation: ' + source);
    const placeholders = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
    assert.deepEqual(placeholders(translation), placeholders(source), 'Mismatched variables: ' + source);
}
assert.equal(formatStoryText('Their name was {victimName}.'), 'Se llamaba Daniel Ortega Vidal.');
setLanguage('en');
assert.equal(t('Start'), 'Start');
assert.equal(formatStoryText('Their name was {victimName}.'), 'Their name was Daniel Ortega Vidal.');
saved.set('roro-language', 'invalid');
assert.equal((await import('../src/managers/LanguageManager.js?invalid')).getLanguage(), 'en');
globalThis.localStorage = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } };
const blocked = await import('../src/managers/LanguageManager.js?blocked');
blocked.setLanguage('es');
assert.equal(blocked.t('Start'), 'Jugar');
console.log('Language checks passed: catalog coverage, variables, story, switching, persistence and blocked storage.');
