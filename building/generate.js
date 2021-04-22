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
    x = x.replace('### ', '');

    let type;

    switch (x.toLowerCase()) {
      case 'fixes': {
        type = 'fixed';
        break;
      }
      
      case 'tweaks': {
        type = 'progress';
        break;
      }

      /*case 'features': {
        type = 'added';
        break;
      }*/

      default: {
        type = 'added'; // 'progress';
        break;
      }
    }

    x = `${i !== 0 ? '\n' : ''}${x} {${type}${i === 0 ? ' marginTop' : ''}}\n======================\n`;
  } else {
    const split = x.split(/,/);

    if (split.length === 1) {
      x = `* **${x}.**`;
    } else {
      const main = split[0].trim();
      let sub = split.slice(1).join(', ').trim();
      sub = sub[0].toUpperCase() + sub.substring(1);

      x = `* **${main}.** ${sub}.`;
    }
  }

  return x;
});

const json = {
  version,
  date,

  body: body.join('\n')
};

console.log(JSON.stringify(json).replaceAll(`\\"`, `\\\\\\"`).replaceAll(`"`, `\\\\\\"`).replaceAll(`\\n`, `\\\\\\\\n`));

// writeFileSync('../out/latestChangelogRelease.json', JSON.stringify(json));