const express = require('express');
const db = require('./config');
const AccountModel = require('./models/account');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const redis = require('redis');
const redisClient = redis.createClient({
    legacyMode: true,
    PORT: 5001
})
const redisStore = require('connect-redis')(session);

redisClient.connect().catch(console.error)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:
    {
        secure: false,

    },
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient }),
}))

//connect to db
db.connect();


const PORT = process.env.PORT || 3000;

app.use(cookieParser());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Access the session as req.session
app.get('/demo', function (req, res, next) {
    if (req.session.views) {
        req.session.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else {
        req.session.views = 1
        res.end('welcome to the session demo. refresh!')
    }
})

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'session.html'));
});

app.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.json('Logout successfully')
});

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
})