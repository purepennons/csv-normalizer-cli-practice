import program from 'commander';
import normalize from './normalize';

function csvNormalizer(input, output) {
  normalize(input, output)
    .then(() => {
      console.log('done')
      process.exit(0)
    })
    .catch(err => {
      console.error('convert failure');
      process.exit(1);
    });
}

let version;

try {
  version = require('./package.json').version;
} catch (err) {
  version = 'development';
}

program
  .version(version, '-v, --version')
  .arguments('<input> <output>')
  .action(csvNormalizer);

program.parse(process.argv);
