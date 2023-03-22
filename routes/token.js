var express = require('express');

var router = express.Router();

const RegModel = require('../../mongoose/RegModel')

const md5 = require('../../npm/node_modules/md5')

const jwt = require('../../npm/node_modules/jsonwebtoken');

let checkToken = function (req, res, next) {
    
}

router.post('/login', (req, res) => {
    // console.log(req.body);
    let { username, password } = req.body;

    RegModel.findOne({ username: username, password: md5(password) }, (err, data) => {
        if (err) {
            res.status(500).send('login data error')
            res.json({
                code: '2001',
                msg: 'get failed',
                data:null
            })
            return
        }
        if (!data) {
             return res.json({
                code: '2002',
                msg: 'username/password wrong',
                data:null
            })
        }
        
        let token = jwt.sign({
            username: data.username,
            _id: data._id,
        }, 'atguigu', { expiresIn: 60 * 60 * 24 * 7 });

        res.json({
            code: '0000',
            msg: 'success',
            data: token
        })

        // res.render('success', { msg: 'login success', url: '/account' })
    })
})
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('success', { msg: 'logout', url: '/login'});
    })
})
module.exports = router;
