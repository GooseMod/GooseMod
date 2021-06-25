import { readFileSync, writeFileSync } from 'fs';

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const firstRelease = changelog.split(/^##/m)[1].trim();

const split = firstRelease.split('\n');

let versionHeader = split[0];
const headerSplit = versionHeader.split(' ');

const version = headerSplit[0];
const date = headerSplit[1].replace(/[\[\]]/g, '');

let body = split.slice(2).map((x) => x.trim().replace('- ', '')).filter((x) => x.length > 0);

body = body.map((x, i) => {
  if (x.startsWith('###')) {
    let type = 'added';

    x = x.replace('### ', '').replace(/\[(.*)\]/, (_, _type) => {
      type = _type;

      return '';
    }).trim();

    x = `${i !== 0 ? '\n' : ''}${x} {${type}${i === 0 ? ' marginTop' : ''}}\n======================\n`;
  } else {
    /* const split = x.split(/,/);

    if (split.length === 1) {
      x = `* **${x}.**`;
    } else {
      const main = split[0].trim();
      let sub = split.slice(1).join(', ').trim();
      sub = sub[0].toUpperCase() + sub.substring(1);

      x = `* **${main}.** ${sub}.`;
    } */

    x = `* ${x}`;
  }

  return x;
});

const json = {
  version,
  date,

  body: body.join('\n')
};

console.log(JSON.stringify(json).replaceAll(`\\"`, `\\\\\\"`).replaceAll(`"`, `\\\\\\"`).replaceAll(`\\n`, `\\\\\\\\n`).replaceAll('/', '\\/'));

// writeFileSync('../out/latestChangelogRelease.json', JSON.stringify(json));