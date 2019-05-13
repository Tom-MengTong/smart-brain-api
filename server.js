const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

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
	let found = false;
	database.users.forEach(user => {
		if (user.id === id){
			console.log("true");
			return res.json(user);
		}
	})
	if(!found){
		res.status(404).json('no such user')	
	}
})

app.post("/signin", (req, res)=>{
	if (req.body.email === database.users[0].email && 
		req.body.password === database.users[0].pwd
		){res.json(database.users[0])}
	else{
		res.status(400).json("err, not correct user")
	}
	
})

app.post("/register", (req, res)=>{
	const {name, email, password} = req.body;
	database.users.push({
		name: name,
		email: email,
		pwd: password,
		entries: 0,
		joined: new Date(),
	});
	res.json(database.users[database.users.length-1]);
})

app.put('/image',(req,res) => {
	const {id} = req.body;
	let found = false;
	database.users.forEach(user=>{
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found){
		res.status(400).json('not found');
	}
})

app.listen(3000, () => {
	console.log ('App is running on port 3000')
});