const { response } = require('express');
const express = require('express');
const AccountModel = require('../models/account');
const router = express.Router();


router.get('/', (req, res, next) => {
    AccountModel.find({})
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json('Lỗi server')
        });
});


router.post('/', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    AccountModel.create({
        username: username,
        password: password
    })
        .then(data => {
            res.send('Thêm tài khoản thành công');
        })
        .catch(err => {
            res.status(500).json('Server error');
        });


});


router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    let newPassword = req.body.password;
    AccountModel.findByIdAndUpdate(id, {
        password: newPassword
    })
        .then(data => {
            res.send('Update thành công');
        })
        .catch(err =>
            res.status(500).json('Server error')
        );
});



router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    AccountModel.deleteOne({ _id: id })
        .then(data => {
            res.send('Delete thành công');
        })
        .catch(err => {
            res.status(500).json('Server error');
        });
});


module.exports = router;