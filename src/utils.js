const uuid = require('uuid/v4')
const path = require('path')

function newId (domain) {
  return uuid()
}

function homeDir () {
  return path.resolve(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'])
}

var utils = {
  newId,
  homeDir
}

module.exports = utils
