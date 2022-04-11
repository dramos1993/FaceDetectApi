const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');
const { user } = require('pg/lib/defaults');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile')
const image = require('./controllers/image');

const { handle } = require('express/lib/application');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'facedetect'
    }
});

console.log(db.select('*').from('users').then(data => {
    //console.log(data);
}));

app.use(bodyParser.json());
app.use(cors());


app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.get('/', (req, res) => {

    res.send('success')

})

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })


app.put('/image', (req, res) => {
    image.handleImage(req, res, db)
})

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// bcrypt.hash(password, null, null, function (err, hash) {
//     console.log(hash);
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//     // res = false
// });




let port = 3001
app.listen(port, () => {

    console.log(`app is running on port ${port}`)
})



/*
    /--> res = this is working
    /signin --> POST = success/fail
    /register --> POST = user
    /profile/:userId --> GET = user
    /image --> PUT --> user 

*/