import { exec } from 'child_process';

import genChangelog from './genChangelog';


export default () => {
  const changelog = genChangelog();

  return {
    name: 'goosemod',

    renderChunk: async (code) => {
      const commitHash = await new Promise((res) => exec(`git rev-parse HEAD`, (_err, stdout) => res(stdout.trim())));

      return code
        .replace('<changelog>', changelog)
        .replace('<hash>', commitHash) + '//# sourceURL=GooseMod';
    }
  }
};