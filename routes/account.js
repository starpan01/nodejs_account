const express = require('express');

const moment = require('moment')

const router = express.Router();

const AccountModel = require('../../mongoose/AccountModel.js')

const shortid = require('shortid');

const jwt = require('../../npm/node_modules/jsonwebtoken');

let checkToken = (req, res, next) => {

  let token = req.get('token');

  if (!token) {
    return res.json({
      code: '2003',
      msg: 'token not found',
      data: null
    })
  }

  jwt.verify(token, 'atguigu', (err, data) => {
    if (err) {
      return res.json({
        code: '2004',
        msg: 'verify failed',
        data: null
      })
    }
    req.user = data;
    console.log(req.user);
    next();
  });
}
  
router.get('/account',checkToken, function (req, res, next) {
  // let account = db.get('account').value();
  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.json({
        code: '1001',
        msg: '读取失败',
        data: null
      })
      return;
    }
    // res.render('list', { account: data,moment:moment});
    res.json({
      code: '0000',
      msg: '读取成功',
      data: data
    })
  })
});

router.post('/account',checkToken, (req, res) => {
  // console.log(req.body);
  // let id = shortid.generate();
  // db.get('account').unshift({ id: id, ...req.body }).write();
  req.body.time = moment(req.body.time).toDate();
  AccountModel.create({
    ...req.body
  }, (err, data) => {
    if (err) {
      return res.json({
        code: '1001',
        msg: 'failure',
        data:null
      })
      
    }
    res.json({
      code: '0000',
      msg: 'success',
      data:data
    })
  })
})


router.delete('/account/:id',checkToken, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      return res.json({
        code: '1002',
        msg: 'delete failed',
        data:null
      })
      
    }
    res.json({
      code: '0000',
      msg: 'success',
      data:null
    })
  })
})
router.get('/account/:id',checkToken, (req, res) => {
  let id = req.params.id;
  // console.log(id);
  AccountModel.findById(id,(err, data) => {
    if (err) {
      return res.json({
        code: '1004',
        msg: 'failure',
        data:null
      })
    }
    res.json({
    code: '0000',
    msg: 'success',
    data:data
    })
  })
})
router.patch('/account/:id',checkToken, (req, res) => {
  let { id } = req.params;
  AccountModel.updateOne({ _id: id }, req.body,(err,data)=> {
    if (err) {
      return res.json({
        code: '1005',
        msg: ' update failure',
        data:null
      })
    }
    AccountModel.findById(id, (err, data) => {
      if (err) {
        return res.json({
          code: '1001',
          msg: 'get account failed',
          data:null
        })
      }
      res.json({
      code: '0000',
      msg: 'update success',
      data:data
      })
    })
    
  })
})

module.exports = router;
