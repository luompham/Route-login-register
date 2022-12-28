const express = require('express');
const db = require('./config');
const AccountModel = require('./models/account');

const app = express();

//connect to db
db.connect();


const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    AccountModel.findOne({
        username: username
    })
        .then(data => {
            if (data) {
                res.send('user already exists');
            } else {
                return AccountModel.create({
                    username: username,
                    password: password,
                })
            }
        })
        .then(data => {
            res.json('Tạo tài khoản thành công');
        })

        .catch(err => {
            res.status(500).json('Tạo tài khoản thất bại')
            console.log(err);
        })
});


app.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    AccountModel.findOne({
        username: username,
        password: password
    })
        .then(data => {
            if (data) {
                res.json('Đăng nhập  thành công');
            } else {
                res.status(400).json('Đăng nhập  thất bại');
            }
        })
        .catch(err => {
            res.status(500).json('Lỗi server')
        });

});


const accountRouter = require('./routers/account');

app.use('/api/account', accountRouter);

app.get('/', (req, res, next) => {
    res.send('welcome Ivan');
});




app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
})