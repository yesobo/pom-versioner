const fs = require('fs'),
  xml2js = require('xml2js'),
  parseString = require('xml2js').parseString,
  semver = require('semver');

function parseXML(path) {
  const xmlContent = fs.readFileSync(path, 'utf-8');
  return new Promise( (resolve, reject) => {
    parseString(xmlContent, { explicitArray: false }, (err, jsObj) => {
      if (err) reject(err);
      resolve(jsObj);  
    })
  })
}

/*
  release type can be snapshot or the types supported by semver package.
  ref: https://www.npmjs.com/package/semver
  inc(v, release): Return the version incremented by the release type (major, premajor, minor, preminor, patch, prepatch, or prerelease)
*/
function updateVersion(version, release, prereleaseId) {
  if (release.toLowerCase() === 'snapshot') {
    if (version.toLowerCase().match('snapshot')) throw Error('Already a SNAPSHOT version');
    return `${version}-SNAPSHOT`;
  }
  return semver.inc(version, release, prereleaseId);
}

function setPomVersion({
  filePath,
  release,
  prereleaseId}) {

  return parseXML(filePath).then( (jsObj) => {
    jsObj.project.version = updateVersion(jsObj.project.version, release, prereleaseId);
    return saveXML(filePath, buildXML(jsObj));
  }) ;
}

function saveXML(path, xmlString) {
  return new Promise( (resolve, reject) => {
    fs.writeFile(path, xmlString, (err) => {
      if(err) reject(err);
      resolve('Pom version changed');
    })
  })
}

function buildXML(jsObj) {
  var builder = new xml2js.Builder();
  return builder.buildObject(jsObj);
}

module.exports = {
  setPomVersion: setPomVersion
};