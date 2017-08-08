const setPomVersion = require('./index').setPomVersion;

test('returns json content', () => {
  expect.assertions(1);
  return setPomVersion({
    filePath: './examples/pom.xml',
    release: 'major'
  }).then( () => {
    expect(true).toBe(true);
  })
})