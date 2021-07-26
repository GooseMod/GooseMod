import sleep from '../util/sleep';

const image = 'https://media.discordapp.net/attachments/756146058924392542/771374562184658944/2018-11-14-11-36-30-1200x800.png';

let version, generated;

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const show = async () => {
  if (!generated) {
    generate();
  }

  goosemodScope.changelog.resetChangelog();

  goosemodScope.changelog.setChangelog(generated);

  goosemodScope.changelog.showChangelog();

  await sleep(300);

  const customTweaks = () => {
    document.querySelector('.modal-1TF_VN .size20-17Iy80').textContent = `GooseMod ${version}`; // Set changelog modal title

    document.querySelector('.modal-1TF_VN .footer-2gL1pp').remove(); // Remove footer of modal with social media
  };

  customTweaks();

  goosemodScope.changelog.resetChangelog();

  // Tweak again since opening it right at beginning of injection / Discord load (eg: GooseMod update) often fails to do after first wait
  setTimeout(customTweaks, 300);
};

export const generate = () => {
  const changelog = JSON.parse("<changelog>");

  version = changelog.version;

  generated = {
    image,

    date: changelog.date,
    body: changelog.body
  };
};