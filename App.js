const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const mongoose = require('mongoose');
const DB = 'mongodb+srv://sky:sky@cluster0.de1mtdi.mongodb.net/todo?retryWrites=true&w=majority';
mongoose.connect(DB).then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

var BookSchema = mongoose.Schema({
    username: String,
    password: String
});

var Book = mongoose.model('Book', BookSchema, 'bookstore');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'ram-dhanu',
    resave: false,
    saveUninitialized: false,
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
    const book1 = new Book({ username: req.body.username, password: pass });
    book1.save();
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    return res.render('./login.ejs', {
        name: null,
    });
})
app.post('/login', async(req, res) => {
    let { username, password } = req.body;
    const user = await Book.find({ username: username });
    if (user === []) {
        return res.render('./login.ejs', {
            name: "This username and password does not exist",
        });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
        return res.render('./login.ejs', {
            name: "This username and password does not exist",
        });
    }
    if (username !== user[0].username) {
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

const port = process.env.port || 5000;
app.listen(port);