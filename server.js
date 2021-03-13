const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const dotenv = require("dotenv");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./database/db");
const app = express();

dotenv.config({path: "./.env"});

const options = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

const sessionStore = new MySQLStore(options);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening at " + 3000));
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(session({
    name: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));