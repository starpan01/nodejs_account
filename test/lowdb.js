// 导入lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
//  将数据存储到文件db.json
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ posts: [], user: {} }).write()

console.log(db.get('posts').value());