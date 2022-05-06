/* eslint @typescript-eslint/no-var-requires: "off" */
let ghpages = require('gh-pages');
let pjson = require('./package.json');

ghpages.publish(
  'public',
  {
    branch: 'gh-pages',
    repo: pjson.repository.url,
    user: {
      name: pjson.person.name,
      email: pjson.person.email
    },
    dotfiles: true
  },
  () => {
    console.log('Deploy Complete!');
  }
);
