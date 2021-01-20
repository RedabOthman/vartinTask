var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var session = require('express-session');

var { getUserByID } = require("./models/api");
var { login } = require('./models/api');
var { create } = require('./models/api');
var { update } = require('./models/api');
var { deleteUser } = require('./models/api')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var checkUser = async function (req, res) {
  if (req.session.isloggedIn) {
    await getUserByID(res, req.session.userid, "profile");
  } else {
    res.render("login", { msg: null, loginData: {} });
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // extract data from login form 

//set up the session 
app.use(
  session({
    secret: "app",
    name: "app",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", function (req, res) {
  return checkUser(req, res);
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs', { msg: null, newUser: {} });
});
app.post("/signup", async (req, res) => {
  let user = {
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password
  }
  await create(user, res);
});

app.get('/login', (req, res) => {
  res.render('login', { msg: null, loginData: {} });
});
app.post("/login", async (req, res) => {
  let user = { email: req.body.email, password: req.body.password }
  await login(user, res, req);
});

app.get('/profile', (req, res) => {
  return checkUser(req, res, indexRouter);
});

//open edit user view
app.post('/update', async (req, res) => {
  await getUserByID(res, req.query.user_id, "updateUserInfo");
});
app.post("/updateUserInfo", async (req, res) => {
  var user = {
    id: req.query.user_id,
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password
  }
  await update(user, res);
});

app.post("/logout", async (req, res) => {
  req.session.isloggedIn = false;
  req.session.userid = null;
  res.render('login', { msg: null, loginData: {} });
});

app.post("/deleteUser", async (req, res) => {
  await deleteUser(req.query.user_id, res, req);
});

app.use('/users', usersRouter);
app.use("/css", express.static(__dirname + "./public/stylesheets/style.css"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
