const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { Client } = require('pg');	
const client = new Client({
	// database: 'MyDatabase',
	// user: 'postgres',
	// password: 'Kimmylo1006',
	// host: 'localhost',
	// port: 5432

	database: 'dccrlpvndk3t8i',
	user: 'yvezuzkosggvle',
	password:'0924e5cdfa5aa86dc4ea4c579b05650096720c7664890378ef046b7ea6684afe',
	host: 'ec2-50-17-250-38.compute-1.amazonaws.com',
	port: 5432,
	ssl: true
});	

client.connect()
	.then(function(){
		console.log('Connected  to database!')
	})
	.catch(function(err){
		console.log('Cannot connect to database')
	});


const app = express();
// tell express which folder is a static/public folder
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.set('port',(process.env.PORT|| 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static1')));

//Redirect to Home Page
app.get('/', function(req,res){
	res.redirect('/Home');
})

//Home Page
app.get('/Home', function(req, res) {
	res.render('Home',{
	});
});

//Under Maintenance
app.get('/Unavailable', function(req, res) {
	res.render('Unavailable',{
	});
});

//Profile Page
app.get('/profile/Mark_Hernandez',function(req,res) {
	res.render('profile', {
		name: "Mark Hernandez",
		status: "Bachelor of Science in Computer Engineering Student",
		email: "markbhernandez527@gmail.com",
		phone: "(+63)936-940-6518",
		imgUrl1: "/Mark1.jpg",
		imgUrl2: "/Mark2.jpg",
		imgUrl3: "/Mark3.jpg",
		imgUrl4: "/Mark4.jpg",
		description: "Hi! I'm Mark, currently a Computer Engineering student in Polytechnic University of the Philippines. My hobbies includes eating, watching TV Series and playing online games. Currently, I'm trying to learn Japanese (Nihongo). ",
	})
});

app.get('/profile/Dwyane_Cueto',function(req,res) {
	res.render('profile', {
		name: "Dwyane Cueto",
		status: "Bachelor of Science in Computer Engineering Student",
		email: "markbhernandez527@gmail.com",
		phone: "(+63)905-895-5967",
		imgUrl1: "/Dwyane1.jpg",
		imgUrl2: "/Dwyane2.jpg",
		imgUrl3: "/Dwyane3.jpg",
		imgUrl4: "/Dwyane4.jpg",
	})
});

//Item Informtion Page
app.get('/AppPage/:Game',(req, res)=>{
	const Game = req.params.Game;
	if (Game == "God Eater") {
		return client.query("SELECT * FROM game_list where id='#0001';")
		.then((results)=>{
			console.log('results?', results);
			res.render('AppPage', results);
			
		})
		.catch((err) => {
			console.log('error',err);
			res.send('Error!');
		});
	}
	if (Game == "Patapon 3") {
		return client.query("SELECT * FROM game_list where id='#0002';")
		.then((results)=>{
			console.log('results?', results);
			res.render('AppPage', results);
			
		})
		.catch((err) => {
			console.log('error',err);
			res.send('Error!');
		});
	}
	if (Game == "Persona 3") {
		return client.query("SELECT * FROM game_list where id='#0003';")
		.then((results)=>{
			console.log('results?', results);
			res.render('AppPage', results);
			
		})
		.catch((err) => {
			console.log('error',err);
			res.send('Error!');
		});
	}
	if (Game == "Phantasy Star 2") {
		return client.query("SELECT * FROM game_list where id='#0004';")
		.then((results)=>{
			console.log('results?', results);
			res.render('AppPage', results);
			
		})
		.catch((err) => {
			console.log('error',err);
			res.send('Error!');
		});
	}
	if (Game == "Radiant Mythology") {
		return client.query("SELECT * FROM game_list where id='#0005';")
		.then((results)=>{
			console.log('results?', results);
			res.render('AppPage', results);
			
		})
		.catch((err) => {
			console.log('error',err);
			res.send('Error!');
		});
	}
	if (Game == "Radiant Mythology 2") {
		return client.query("SELECT * FROM game_list where id='#0006';")
		.then((results)=>{
			console.log('results?', results);
			res.render('AppPage', results);
			
		})
		.catch((err) => {
			console.log('error',err);
			res.send('Error!');
		});
	}
});

//Server
app.listen(app.get('port'), function() {
	console.log('Server started at port 3000');
});