const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const uri = 'mongodb://localhost:27017/sessions';
const client = new MongoClient(uri);
client.connect();
const database = client.db('local');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const store = new MongoDBStore({
    uri: uri,
    collection: 'mySessions'
});


app.use(session({
    secret: 'ram-dhanu',
    resave: false,
    saveUninitialized: false,
    store: store,
}));


app.get('/', (req, res) => {
    return res.render('./regi.ejs', {
        name: null,
    })
});

app.post('/register', async(req, res) => {
    if (req.body.password !== req.body.repassword) {
        return res.render('./regi.ejs', {
            name: "password does not match",
        })
    }
    const pass = await bcrypt.hash(req.body.password, 10);
    client.connect();
    await database.collection("local").insertOne({ username: req.body.username, password: pass });
    await client.close();
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    return res.render('./login.ejs', {
        name: null,
    });
})
app.post('/login', async(req, res) => {
    let { username, password } = req.body;
    await client.connect();
    const user = await database.collection("local").findOne({ username: username });
    if (!user) {
        return res.render('./login.ejs', {
            name: "This username and password does not exist",
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('./login.ejs', {
            name: "This username and password does not exist",
        });
    }
    if (username !== user.username) {
        return res.render('./login.ejs', {
            name: "This username and password does not exist",
        });
    }
    req.session.isAuth = true;
    res.redirect('/dashbord');
});

app.get('/dashbord', (req, res) => {
    if (!req.session.isAuth) {
        return res.render('./login.ejs', {
            name: null,
        });
    }
    res.sendFile(path.resolve('./views/dashbord.html'));
});

app.get('/logout', (req, res) => {
    req.session.isAuth = false;
    res.redirect('/login');
});

app.listen(5678);