import sleep from '../util/sleep';

const image = 'https://media.discordapp.net/attachments/756146058924392542/771374562184658944/2018-11-14-11-36-30-1200x800.png?width=853&height=569';
const changelogURL = 'https://goosemod-api.netlify.app/latestChangelogRelease.json';

let version, generated;

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const show = async () => {
  if (!generated) {
    await generate();
  }

  goosemodScope.changelog.resetChangelog();

  goosemodScope.changelog.setChangelog(generated);

  goosemodScope.changelog.showChangelog();

  await sleep(300);

  document.querySelector('.modal-3O0aXp .title-3sZWYQ').textContent = `GooseMod ${version}`; // Set changelog modal title

  document.querySelector('.modal-3O0aXp .footer-2gL1pp').remove(); // Remove footer of modal with social media

  goosemodScope.changelog.resetChangelog();
};

export const generate = async () => {
  const changelog = await goosemodScope.cspBypasser.json(changelogURL, false);

  version = changelog.version;

  generated = {
    image,

    date: changelog.date,
    body: changelog.body
  };
};