import { exec } from 'child_process';

import genChangelog from './genChangelog';
import geni18nFiles from './i18n';


export default () => {
  return {
    name: 'goosemod',

    renderChunk: async (code) => {
      const changelog = genChangelog();

      const commitHash = await new Promise((res) => exec(`git rev-parse HEAD`, (_err, stdout) => res(stdout.trim())));

      code = code
        .replace('<changelog>', changelog)
        .replace('<hash>', commitHash) + '//# sourceURL=GooseMod';

      geni18nFiles(code);

      return code;
    }
  }
};