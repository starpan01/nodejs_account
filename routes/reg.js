var express = require('express');

var router = express.Router();

const RegModel = require('../../mongoose/RegModel')

const md5 = require('../../npm/node_modules/md5')

router.get('/reg', (req, res) => {
    res.render('reg')
})

router.post('/reg', (req, res) => {
    // console.log(req.body);
    RegModel.create({...req.body,password:md5(req.body.password)}, (err, data) => {
        if (err) {
            res.status(500).send('mongodb create error')
            return
        }
        res.render('success', { msg: 'register success', url: '/login' });
    })
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', (req, res) => {
    // console.log(req.body);
    let { username, password } = req.body;

    RegModel.findOne({ username: username, password: md5(password) }, (err, data) => {
        if (err) {
            res.status(500).send('login data error')
            return
        }
        if (!data) {
            return res.send(`<div>username/password error</div><a href="/login">click</a>`)
        }
        console.log(req.session);
        // console.log(data);
        req.session.username = data.username;
        req.session._id = data._id;
        res.render('success', { msg: 'login success', url: '/account' })
    })
})
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('success', { msg: 'logout', url: '/login'});
    })
})
module.exports = router;
