require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

// Importa servicios y middlewares
const { loginGoogleInitalize } = require('./src/services/googleService');
const localsUserCheckMiddleware = require('./src/middlewares/checkUsers/localsUserCheck');
const cookieCheckMiddleware = require('./src/middlewares/checkUsers/cookieCheck');
const { initializeCronJobs } = require('./src/helpers/cronJobs');

// Inicializa cron jobs
initializeCronJobs();

const app = express();
loginGoogleInitalize();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Configuración de middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'CookieSecret'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(cors());

// Configuración de sesión y Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'Nueva web Encope 2023 con Node.js',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Aplicación de middlewares
app.use(cookieCheckMiddleware);
app.use(localsUserCheckMiddleware);

// Rutas MVC
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');
const authRouter = require('./src/routes/auth');
const licitacionRouter = require('./src/routes/licitacion');
const noticiasRouter = require('./src/routes/noticias');
const stockRouter = require('./src/routes/stock');

// Rutas API
const apiUsersRouter = require('./src/routes/apis/apiUsers');
const apiLicitacionRouter = require('./src/routes/apis/apiLicitaciones');
const apiNoticiasRouter = require('./src/routes/apis/apiNoticias');
const apiStockRouter = require('./src/routes/apis/apiStock');
const apiInsumosRouter = require('./src/routes/apis/apiInsumos');

// Definir rutas
app.use('/', indexRouter);
app.use('/licitacion', licitacionRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/noticias', noticiasRouter);
app.use('/stock', stockRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/licitacion', apiLicitacionRouter);
app.use('/api/noticias', apiNoticiasRouter);
app.use('/api/stock', apiStockRouter);
app.use('/api/insumos', apiInsumosRouter);

// Manejo de errores
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', {
    title: "error",
    userLogin: req.session.userLogin
  });
});

module.exports = app;
