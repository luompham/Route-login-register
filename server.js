const express = require('express');
const db = require('./config');
const AccountModel = require('./models/account');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


//connect to db
db.connect();


const PORT = process.env.PORT || 3000;

app.use(cookieParser());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    AccountModel.findOne({
        username: username,
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
                let token = jwt.sign({ _id: data._id }, 'secret');
                return res.json({
                    message: 'Success',
                    token: token,
                });
            } else {
                res.status(400).json('Đăng nhập  thất bại');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });

});

//server check xem người dùng đã đăng nhập thành công chưa
let checkLogin = (req, res, next) => {
    // check login
    try {
        let token = req.cookies.token;
        let result = jwt.verify(token, 'secret');
        // let id = result._id;
        AccountModel.findOne({ _id: result })
            .then(data => {
                let user = data.username;
                res.data = user;
                if (data) {
                    req.data = data;
                    next();
                } else {
                    res.json('Not have access!!!')
                }
            })
            .catch(err => {
            })
    } catch (error) {
        return res.redirect('/login')
    }
}

let checkStudent = (req, res, next) => {
    let role = req.data.role;
    if (role === 'student' || role === 'teacher' || role === 'manager') {
        next();
    } else {
        res.json('Not have access!!!')
    }
};

let checkTeacher = (req, res, next) => {
    let role = req.data.role;
    if (role === 'teacher' || role === 'manager') {
        next();
    } else {
        res.json('Not have access!!!')
    }
};

let checkManager = (req, res, next) => {
    let role = req.data.role;
    if (role === 'manager') {
        next();
    } else {
        res.json('Not have access!!!')
    }
};

app.get('/tasks', checkLogin, checkStudent, (req, res, next) => {
    console.log(req.data);
    res.send(`All Tasks Page`);
});

app.get('/students', checkLogin, checkTeacher, (req, res, next) => {
    res.send(`Student Page`);
});

app.get('/teachers', checkLogin, checkManager, (req, res, next) => {
    res.send(`Teacher Page`);
});


const accountRouter = require('./routers/account');

app.use('/api/account', accountRouter);

app.get('/home', checkLogin, (req, res, next) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.post('/edit', (req, res, next) => {
    let token = req.headers.token;
    let decode = jwt.verify(token, 'secret');
    let userId = decode._id;
    AccountModel.findById(userId)
        .then(data => {
            console.log(userId)
            if (data.role === 'manager') {

                next();
            } else {
                return console.log('Not have access!!!');
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })

}, (req, res, next) => {
    res.send('Edit successfully')
})


app.get('/', (req, res, next) => {
    res.send('welcome Ivan');
});

app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'login.html'));
})


app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
})