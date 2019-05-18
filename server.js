const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const Clarify = require('clarifai');
const saltRounds = 10;
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const imagePredict = require('./controllers/imagePredict');



const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'Tom',
    password : 'Dashabi123',
    database : 'smart-brain'
  }
});

// db.select().table('users').then(data => {
// 	console.log(data);
// });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req,res)=>{res.send('it is working') })
app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, db) });
app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imagePredict', (req, res) => { imagePredict.handleImagePredict(req, res, Clarifai) });

app.listen(process.env.PORT || 3000, () => {
	console.log (`App is running on port ${process.env.PORT}`)
});