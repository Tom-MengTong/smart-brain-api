const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

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

const database = {
	users:[
		{
			id: "1",
			name: "jon",
			email: "jon@gmail.com",
			pwd: "123",
			entries: 0,
			joined: new Date()
		},
		{
			id: "2",
			name: "snow",
			email: "snow@gmail.com",
			pwd: "king",
			entries: 0,
			joined: new Date()
		}
	]
}

app.get("/", (req,res)=>{
	res.send(database.users)
})

app.get("/profile/:id", (req,res) => {
	const {id} = req.params;
	db.select('*').from('users').where('id',id)
	.then(user => {
		if(user.length){
			res.json(user[0])
		} else {
			res.status(400).json('not found')
		}	
	})
})

app.post("/signin", (req, res)=>{
	db.select('email','hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			console.log(isValid);
			console.log(req.body.password);
			console.log(data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			}else{
				res.status(400).json('it is wrong credentials');	
			}
			
		})
		.catch(err=> res.status(400).json('wrong credentials'))
	
})

app.post("/register", (req, res)=>{
	const {name, email, password} = req.body;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: loginEmail[0],
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		
})

app.put('/image',(req,res) => {
	const {id} = req.body;
	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	}).catch(err => {
		res.status(400).json('unable to get account');
	})
})

app.listen(3000, () => {
	console.log ('App is running on port 3000')
});