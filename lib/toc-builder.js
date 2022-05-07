const BroccoliPlugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { join, dirname } = require('path');
const _ = require('lodash');

module.exports = class TocBuilder extends BroccoliPlugin {
  constructor(folder, options) {
    super([folder], options);
  }

  build() {
    this.inputPaths.forEach((dir) => {
      mkdirSync(join(this.outputPath, 'tocs'));

      const allJsonFiles = walkSync(dir).filter((path) =>
        path.endsWith('.json')
      );

      const groupedJsonFiles = _.groupBy(allJsonFiles, (file) => dirname(file));

      for (let groupedDir in groupedJsonFiles) {
        const jsonFiles = groupedJsonFiles[groupedDir];

        const tocs = _.chain(jsonFiles)
          .map((file) => {
            const fileContents = JSON.parse(readFileSync(join(dir, file)));

            // remove any collated files
            if (Array.isArray(fileContents.data)) {
              return;
            }

            return {
              id: fileContents.data.id,
              stage: fileContents.data.relationships?.stage.data.id ?? '_',
              startDate: fileContents.data.attributes?.startDate,
            };
          })
          .compact()
          .sortBy(['id'])
          .value();

        const links = tocs.map((toc) => toc.id);

        const stageLinks = _.groupBy(links, (id) => {
          const toc = tocs.find((toc) => toc.id === id);
          return toc.stage;
        });

        const stages = _.chain(stageLinks)
          .keys()
          .filter((stage) => stage !== '_')
          .sortBy((stage) => stage)
          .value();

        writeFileSync(
          join(this.outputPath, 'tocs', `${groupedDir}.json`),
          JSON.stringify({
            data: {
              type: 'tocs',
              id: groupedDir,
              attributes: {
                links,
                stages,
                stageLinks,
              },
            },
          })
        );
      }
    });
  }
};
