function data (db) {
  return {
    set: function (key, value) { return db.set(key, value).write() },
    get: function (key) { return db.get(key).value() }
  }
}

module.exports = data
