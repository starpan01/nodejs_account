var express = require('express');
const moment = require('moment')
var router = express.Router();
const AccountModel = require('../../mongoose/AccountModel.js')

// 这是记账本的列表
/* GET home page. */
const low = require('lowdb')

const FileSync = require('lowdb/adapters/FileSync')

//  将数据存储到文件db.json

const adapter = new FileSync(__dirname + '/../test/db.json');

const db = low(adapter)

const shortid = require('shortid');

let checkLogin = function (req, res, next) {
  if (!req.session.username) {
    return res.redirect('/login')
  }
  next();
}

router.get('/account', checkLogin,function (req, res, next) {
  // let account = db.get('account').value();
  if (!req.session.username) {
    return res.redirect('/login')
  }
  AccountModel.find().sort({ time: -1 }).exec((err, data)=>{
    if (err) {
      res.status(500).send('failure');
      return;
    }
    res.render('list', { account: data, moment: moment });
  })
});

router.get('/', (req, res) => {
  res.redirect('/account');
})
router.post('/account', checkLogin,(req, res) => {
  // console.log(req.body);
  // let id = shortid.generate();
  // db.get('account').unshift({ id: id, ...req.body }).write();
  req.body.time = moment(req.body.time).toDate();
  AccountModel.create({
    ...req.body
  }, (err, data) => {
    if (err) {
      res.status(500).send('failure');
      return;
    }
    res.render('success', { msg: '添加成功哦~', url: '/account' });
  })
})

router.get('/account/create', checkLogin,function(req, res, next) {
  res.render('create')
});
router.get('/account/:id', (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send('failure');
      return;
    }
    res.render('success',{msg:'删除成功哦~',url:'/account'});
  })
  
})

module.exports = router;
