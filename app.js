const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride=require('method-override');
//const bodyParser = require('body-parser')
const passport = require('./passport/passport');
const flash = require('connect-flash');
const session = require("express-session");
const connectDB = require('./dal/db');
require('dotenv').config();
const expressHbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const adAccountRouter = require('./routes/adminAccount');
const ordersRouter = require('./routes/orders');
const manufacturersRouter = require('./routes/manufacturers');
const authRouter = require('./routes/auth');
const mailerRouter = require('./routes/mailer');

const app = express();

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: '../layout',
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  helpers: {
    section: hbs_sections(),
  }
}))
app.set('view engine', '.hbs');

const hbs = expressHbs.create({});

//Kết nối csdl
connectDB();

//Khởi tạo method-override
app.use(methodOverride('_method'));

//Khởi tạo body-parser
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport middleware
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// pass req.user
app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

const ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login')
}

app.use('/auth', authRouter);
app.use('/mail', mailerRouter);

// usersRouter contains all open routes like '/login':
app.use('/', indexRouter);

// From here on, all routes need authorization:
app.use(ensureAuthenticated);

app.use('/', indexRouter);
app.use('/list-accounts', usersRouter);
app.use('/list-products', productsRouter);
app.use('/my-account', adAccountRouter);
app.use('/list-orders', ordersRouter);
app.use('/list-manufacturers', manufacturersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
