import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('../inject.js', 'utf-8');

let modules = ['backend/fucklytics.js', 'backend/devMode.js', 'visual/visualTweaks.js', 'visual/twitchEmotes.js', 'visual/roleColoredMessages.js'];

let replaceText = '';

for (let m of modules) {
  let c = readFileSync(`../modules/${m}`, 'utf-8');

  replaceText += `{
    filename: '${m.split('/').slice(1)}',
    data: \`${c.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$/g, '\\$')}\`
  },`;
}

content = content.replace('this.embedded = false;', 'this.embedded = true;');

content = content.replace('//<TEMPLATE_REPLACE>', replaceText);

console.log(replaceText, content);

writeFileSync('embedded.js', content);