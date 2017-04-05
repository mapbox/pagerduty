'use strict';

const file = require(`${__dirname}/../lib/utils`);
const test = require('tape');

test('[utils] [updateUrl]', (t) => {
  t.equal(file.updateUrl('http://localhost:3333/users?query=Test%20User', 10), 'http://localhost:3333/users?query=Test%20User&offset=10&total=true&limit=100', 'no search parameters provided');
  t.equal(file.updateUrl('http://localhost:3333/users?query=Test%20User&offset=5', null), 'http://localhost:3333/users?query=Test%20User&offset=5&total=true&limit=100', 'offset provided');
  t.equal(file.updateUrl('http://localhost:3333/users?query=Test%20User&total=false', 10), 'http://localhost:3333/users?query=Test%20User&total=false&offset=10&limit=100', 'total provided');
  t.equal(file.updateUrl('http://localhost:3333/users?query=Test%20User&limit=100', 10), 'http://localhost:3333/users?query=Test%20User&limit=100&offset=10&total=true', 'offset provided');
  t.equal(file.updateUrl('http://localhost:3333/users?query=Test%20User&limit=100&total=false&offset=5', null), 'http://localhost:3333/users?query=Test%20User&limit=100&total=false&offset=5', 'all search parameters provided');
  t.end();
});
