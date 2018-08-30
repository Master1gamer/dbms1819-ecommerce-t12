const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const nodemailer = require('nodemailer');
const Product = require('./models/Product');
const Brand = require('./models/Publisher');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Category = require('./models/Genre');


//**********DataBase**********//
const client = new Client({

  database: 'dccrlpvndk3t8i',
  user: 'yvezuzkosggvle',
  password: '0924e5cdfa5aa86dc4ea4c579b05650096720c7664890378ef046b7ea6684afe',
  host: 'ec2-50-17-250-38.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});

client.connect()
  .then(function () {
    console.log('Connected  to database!');
  })
  .catch(function (err) {
    console.log('Cannot connect to database');
  });


const app = express();
// tell express which folder is a static/public folder
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static1')));

//**********Body Parser middleware**********//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Redirect to Home Page
app.get('/', function (req, res) {
  res.redirect('Customer Pages/Home');
});


//**********Start of Customer Pages**********//
// Home Page
app.get('/home', function (req, res) {
  client.query("SELECT * FROM game_images", (err, res1) => {
    res.render('Customer Pages/Home', {
      data: res1.rows
    });
  })
});

// Genre Page
app.get('/genre', function (req, res) {
  return client.query('SELECT gen_name FROM game_gen Order by gen_name;')
    .then((results) => {
      console.log('results?', results);
      res.render('CUstomer Pages/genre', results);
    });
});

// Publisher Page
app.get('/publisher', function (req, res) {
  return client.query('SELECT pub_name FROM game_pub Order by pub_name;')
    .then((results) => {
      console.log('results?', results);
      res.render('Customer Pages/publisher', results);
    });
});

// Item Informtion Page
app.get('/AppPage/:Game', (req, res) => {
  const Game = req.params.Game;
  return client.query("SELECT * FROM game_list where game_name='" + Game + "';")
    .then((results) => {
      console.log('results?', results);
      res.render('Customer Pages/AppPage', results);
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

// Customers List Page
app.get('/customers', (req, res) => {
  client.query('SELECT * from customer', (err3, datacustomer) => {
    console.log('results?', datacustomer);
    res.render('Customer Pages/customer-list', {
      data: datacustomer.rows
    });
  });
});

// Customers Page
app.get('/customers/:id', (req, res) => {
  var id = req.params.id;
  console.log('ID', id);
  client.query("SELECT * from customer where gamer_id='" + id + "'", (err5, customerlist) => {
    console.log('results?', customerlist);
    client.query("SELECT game_list.game_name, game_list.price, orders.quantity, orders.date_purchase, orders.order_id from game_list INNER JOIN orders ON orders.game_id=game_list.game_id WHERE gamer_id='" + id + "'", (err5, customerdata) => {
      res.render('Customer Pages/customer-page', {
        data1: customerlist.rows,
        data2: customerdata.rows
      });
    });
  });
});

// Orders Page
app.get('/Orders', (req, res) => {
  client.query('SELECT * FROM orders INNER JOIN customer on customer.gamer_id=orders.gamer_id INNER JOIN game_list on orders.game_id=game_list.game_id', (err5, orderlist1) => {
    console.log('results?', orderlist1);
    res.render('Customer Pages/orders', orderlist1);
  });
});

//**********END of Customer Pages**********//



//**********Start of Admin Pages**********//

// Admin Page
app.get('/admin/home', function (req, res) {
  client.query("SELECT * FROM game_images", (err, res1) => {
    res.render('Admin Pages/Home', {
      data: res1.rows
    });
  })
});

// Genre Page
app.get('/Admin/genre', function (req, res) {
  return client.query('SELECT gen_name FROM game_gen Order by gen_name;')
    .then((results) => {
      console.log('results?', results);
      res.render('Admin Pages/genre', results);
    });
});

// Publisher Page
app.get('/Admin/publisher', function (req, res) {
  return client.query('SELECT pub_name FROM game_pub Order by pub_name;')
    .then((results) => {
      console.log('results?', results);
      res.render('Admin Pages/publisher', results);
    });
});

// Create Publisher Page
app.get('/Admin/publisher/create', function (req, res) {
  res.render('Admin Pages/create_publisher', {
  });
});

// Item Informtion Page
app.get('/Admin/AppPage/:Game', (req, res) => {
  const Game = req.params.Game;
  return client.query("SELECT * FROM game_list where game_name='" + Game + "';")
    .then((results) => {
      console.log('results?', results);
      res.render('Admin Pages/AppPage', results);
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

// Customers List Page
app.get('/Admin/customers', (req, res) => {
  client.query('SELECT * from customer', (err3, datacustomer) => {
    console.log('results?', datacustomer);
    res.render('Admin Pages/customer-list', {
      data: datacustomer.rows
    });
  });
});

// Customers Page
app.get('/Admin/customers/:id', (req, res) => {
  var id = req.params.id;
  console.log('ID', id);
  client.query("SELECT * from customer where gamer_id='" + id + "'", (err5, customerlist) => {
    console.log('results?', customerlist);
    client.query("SELECT game_list.game_name, game_list.price, orders.quantity, orders.date_purchase, orders.order_id from game_list INNER JOIN orders ON orders.game_id=game_list.game_id WHERE gamer_id='" + id + "'", (err5, customerdata) => {
      res.render('Admin Pages/customer-page', {
        data1: customerlist.rows,
        data2: customerdata.rows
      });
    });
  });
});

// Orders Page
app.get('/Admin/Orders', (req, res) => {
  client.query('SELECT * FROM orders INNER JOIN customer on customer.gamer_id=orders.gamer_id INNER JOIN game_list on orders.game_id=game_list.game_id', (err5, orderlist1) => {
    console.log('results?', orderlist1);
    res.render('Admin Pages/orders', orderlist1);
  });
});

// Create Genre Page
app.get('/Admin/genre/create', function (req, res) {
  res.render('Admin Pages/create_genre', {
  });
});

app.post('/Admin/genre/create', function (req, res) {
  client.query("SELECT * FROM game_gen where gen_name='" + req.body.genre_name + "'", (err, res1) => {
    if (res1.rowCount >= 1) {
      res.render('Confirm', {
        msg: 'The genre is already existing'
      });
    } else {
      client.query("INSERT INTO game_gen (gen_name) VALUES ('" + req.body.genre_name + "')");
      res.redirect('/Admin/genre');
    }
  });
});

app.post('/Admin/publisher/create', function (req, res) {
  client.query("SELECT * FROM game_pub where pub_name='" + req.body.publisher_name + "'", (err, res1) => {
    if (res1.rowCount >= 1) {
      res.render('Confirm', {
        msg: 'The publisher is already existing'
      });
    } else {
      client.query("INSERT INTO game_pub (pub_name) VALUES ('" + req.body.publisher_name + "')");
      res.redirect('/Admin/publisher');
    }
  });
});

// Edit Item Information Page
app.get('/Admin/Update/:Game', (req, res) => {
  const Game = req.params.Game;
  client.query("SELECT * FROM game_list where game_name='" + Game + "'", (err, results) => {
    console.log('results?', results);
    client.query('SELECT gen_name, gen_id FROM game_gen', (err2, datagen) => {
      client.query('SELECT pub_name, pub_id FROM game_pub', (err3, datapub) => {
        res.render('Admin Pages/update-game', {
          data: results.rows,
          gen: datagen.rows,
          pub: datapub.rows
        });
      });
    });
  });
});

// Update Post
app.post('/Admin/update/:Game/send', function (req, res) {
  const Game = req.params.Game;
  client.query("UPDATE game_list SET game_name='" + req.body.game_name + "', game_gen='" + req.body.genre + "', game_pub='" + req.body.publisher + "', price='" + req.body.price + "', description='" + req.body.description + "' WHERE game_name='" + Game + "'");
  res.redirect('/Admin/home');
});

// Profile Page
app.get('/profile/Mark_Hernandez', function (req, res) {
  res.render('profile', {
    name: 'Mark Hernandez',
    status: 'Bachelor of Science in Computer Engineering Student',
    email: 'markbhernandez527@gmail.com',
    phone: '(+63)936-940-6518',
    imgUrl1: '/Mark1.jpg',
    imgUrl2: '/Mark2.jpg',
    imgUrl3: '/Mark3.jpg',
    imgUrl4: '/Mark4.jpg',
    description: "Hi! I'm Mark, currently a Computer Engineering student in Polytechnic University of the Philippines. My hobbies includes eating, watching TV Series and playing online games. Currently, I'm trying to learn Japanese (Nihongo). "
  });
});

app.get('/profile/Dwyane_Cueto', function (req, res) {
  res.render('profile', {
    name: 'Dwyane Cueto',
    status: 'Bachelor of Science in Computer Engineering Student',
    email: 'markbhernandez527@gmail.com',
    phone: '(+63)905-895-5967',
    imgUrl1: '/Dwyane1.jpg',
    imgUrl2: '/Dwyane2.jpg',
    imgUrl3: '/Dwyane3.jpg',
    imgUrl4: '/Dwyane4.jpg'
  });
});

//**********End of Admin Pages**********//



// Under Maintenance
app.get('/unavailable', function (req, res) {
  res.render('Unavailable', {
  });
});


//**********Send Email (Post)**********//
app.post('/AppPage/:Game/send', function (req, res) {
  console.log(req.body);
  var id = req.params.Game;
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Customer Name: ${req.body.Fname} ${req.body.Lname}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>Email: ${req.body.email}</li>
      <li>Product ID:${req.body.productid}</li>
      <li>Quantity: ${req.body.quantity}</li>
      <li>Price: ${req.body.price}</li>
    </ul>
  `;
  const output2 = `
    <p>Here's the list of details of your order</p>
    <h3>Details</h3>
    <ul>
      <li>Customer Name: ${req.body.Fname} ${req.body.Lname}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>Email: ${req.body.email}</li>
      <li>Product ID:${req.body.productid}</li>
      <li>Quantity: ${req.body.quantity}</li>
      <li>Price: ${req.body.price}</li>
    </ul>
  `;
  client.query("SELECT * FROM customer where email='" + req.body.email + "'", (err, results) => {
    if (results.rowCount >= 1) {
      client.query("SELECT * FROM customer where email='" + req.body.email + "' ", (req1, data2) => {
        client.query("INSERT INTO orders (gamer_id, game_id, quantity, date_purchase) VALUES ('" + data2.rows[0].gamer_id + "','" + req.body.productid + "','" + req.body.quantity + "', CURRENT_TIMESTAMP)");
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'dbms.team12@gmail.com',
            pass: '1q2w3e4rt5'
          }
        });

        let mailOptions1 = {
          from: '"game_list mailer" <team12module1@gmail.com>',
          to: 'markbhernandez528@gmail.com',
          subject: 'Game Order Request',
          html: output
        };
        let mailOptions2 = {
          from: '"game_list mailer" <team12module1@gmail.com>',
          to: req.body.email,
          subject: 'Game Order Request',
          html: output2
        };
        transporter.sendMail(mailOptions1, (error, info) => {
          if (error) {
            return console.log(error);
            res.render('Confirm', {
              msg: '---Error sending your order!!!---'
            });
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        transporter.sendMail(mailOptions2, (error, info) => {
          if (error) {
            return console.log(error);
            res.render('Confirm', {
              msg: '---Error sending your order!!!---'
            });
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          client.query('SELECT * FROM game_list', (req, data) => {
            var list = [];
            for (var i = 0; i < data.rows.length + 1; i++) {
              if (i === id) {
                list.push(data.rows[i - 1]);
              }
            }
            res.render('Confirm', {
              data: list,
              msg: 'Email has been sent!!! An email has also been sent to you as copy of your order!!'
            });
          });
        });
      });
    } else {
      client.query("INSERT INTO customer (gamer_fname, gamer_lname, email, phone) VALUES ('" + req.body.Fname + "','" + req.body.Lname + "','" + req.body.email + "', '" + req.body.phone + "')");
      client.query("SELECT * FROM customer where email='" + req.body.email + "' ", (req1, data3) => {
        client.query("INSERT INTO orders (gamer_id,game_id, quantity, date_purchase) VALUES ('" + data3.rows[0].gamer_id + "','" + req.body.productid + "','" + req.body.quantity + "', CURRENT_TIMESTAMP)");
        // nodemailer
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'dbms.team12@gmail.com',
            pass: '1q2w3e4rt5'
          }
        });
        let mailOptions = {
          from: '"game_list mailer" <team12module1@gmail.com>',
          to: 'markbhernandez528@gmail.com, ++',
          subject: 'Game Order Request',
          html: output
        };
        let mailOptions2 = {
          from: '"game_list mailer" <team12module1@gmail.com>',
          to: req.body.email,
          subject: 'Game Order Request',
          html: output2
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
            res.render('Confirm', {
              msg: '---Error sending your order!!!---'
            });
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        transporter.sendMail(mailOptions2, (error, info) => {
          if (error) {
            return console.log(error);
            res.render('Confirm', {
              msg: '---Error sending your order!!!---'
            });
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          client.query('SELECT * FROM game_list', (req, data) => {
            var list = [];
            for (var i = 0; i < data.rows.length + 1; i++) {
              if (i === id) {
                list.push(data.rows[i - 1]);
              }
            }
            res.render('Confirm', {
              data: list,
              msg: 'Email has been sent!!! Also a new account has been made!!'
            });
          });
        });
      });
    }
  });
});

// Server
app.listen(app.get('port'), function () {
  console.log('Server started at port 3000');
});
