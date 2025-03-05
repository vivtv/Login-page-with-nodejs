const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(cors());
// Middleware to parse request body
app.use(bodyParser.json()); //{key:value}
app.use(bodyParser.urlencoded({ extended: true })); //received data by form

let users = [
    {username: "Testentry", email:"example@gmail.com", password:"123456789"}
];

// Routing
// http://localhost:3000
app.get('/', (req, res) =>  {
    res.send('<h1>Welcometo my home page.<h1>');
});

// http://localhost:3000/item/1cl
app.get('/item/:id', (req, res) =>  {
    const id = req.params.id;
    res.send(`Received item id: ${id}`);
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    
    const sql = "SELECT * a_pwd FORM account WHERE a_email=?";
    db.query(sql, [email], async (err, result) => {
        if(err) {
            res.send("Error user:" + email);
        } else if (result.length > 0){
            const user = result[0];
            const match = await bcrypt.compare(password, user.a_pwd);
            if(match){
                res.redirect('/products');
            } else {
                res.send('Invalid email or password!');
            }
        }
    });
});

app.post('/register', async (req, res) => {
    const {username, email, password, confirm_password} = req.body;

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    
    db.query("INSERT INTO account(a_name,a_email,a_pwd) VALUES(?,?,?)", [username,email,hashPassword], (err, result)=>{
        if (err){
            res.status(500).json({ error: err.message});
        } else {
            res.redirect('/login')
        }
    });
});

app.get('/products', (req, res) => {
    res.render('products');
});

// Start server
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});