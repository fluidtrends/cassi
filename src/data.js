const data = { set, get }

function set (db, key, value) {
  return db.set(key, value).write()
}

function get (db, key) {
  return db.get(key).value()
}

module.exports = data
