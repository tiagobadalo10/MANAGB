var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var initRouter = require('./routes/init');
var taskRouter = require('./routes/task');
var tasksRouter = require('./routes/tasks');
var userRouter = require('./routes/user');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/project');
var projectsRouter = require('./routes/projects');
var teamsRouter = require('./routes/teams');
var teamRouter = require('./routes/team');
var meetingsRouter = require('./routes/meetings');
var meetingRouter = require('./routes/meeting');

var app = express();
app.use(cors())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/init', initRouter);
app.use('/task', taskRouter);
app.use('/tasks', tasksRouter);
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/project', projectRouter);
app.use('/projects', projectsRouter);
app.use('/teams', teamsRouter);
app.use('/team', teamRouter);
app.use('/meetings', meetingsRouter);
app.use('/meeting', meetingRouter);

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://psi018:psi018@cluster0.dp5bj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

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