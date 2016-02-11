
var express    = require('express');
var app        = express();
var PORT       = process.env.PORT || 3001;
var db         = require('./db/mongo');
var bodyParser = require('body-parser');
var Mongoose   = require('mongoose');
var bcrypt     = require('bcrypt');
var passport   = require('passport');
var plm        = require('passport-local-mongoose');
var LocalStrategy  = require( 'passport-local' ).Strategy;


app.use(bodyParser.json());

var tasksSchema = Mongoose.Schema ({
  title     : String,
  desc      : String,
  priority  : String,
  createdBy : String,
  assignedTo: String,
  status    : String
});

var todos = Mongoose.model('todos', tasksSchema);

app.use(express.static('./public'));

app.get('/api', function (req, res) {
  todos.find(function (err, data) {
    if (err) return console.error(err);
    res.json(data);
  });
});

app.post('/api/add', function (req, res) {
  new todos({
    title     : req.body.title,
    desc      : req.body.desc,
    priority  : req.body.priority,
    createdBy : req.body.createdBy,
    assignedTo: req.body.assignedTo,
    status    : "__status__toDo__"
  }).save();
    // .then(function (data) {
      // console.log('redirect');
      return res.send('/');
    // });
});

app.delete('/api/delete/:id', function (req, res) {
  todos.find({ _id: req.params.id}).remove().exec()
  .then(function (data) {
    return res.json( data );
  })
  .catch(function (err) {
    console.error(err);
  });
});

app.put('/api/update', function (req, res) {
  return todos.findOneAndUpdate({ _id : req.body._id },
    { $set : res }, { new: true }, function(){
      console.log("updated");
    });
});

app.get('*', function (req,res) {
  res.sendFile('/public/index.html', { root : __dirname });
});

//============ register user ===================

var User = Mongoose.Schema ({
  username  : String,
  password  : String
});

var options = ({missingPasswordError: "Foutief password"});
User.plugin(plm,options);

var users = Mongoose.model('users', User);

app.post('/api/register', function (req, res) {
  var hash = bcrypt.hashSync(req.body.password);

  new users({
    username : req.body.username,
    password : hash
  }).save();
    return res.send('/login');
});

//============= logging in ======================

passport.use( new LocalStrategy(
  function (username, password, done) {
    console.log("hash", password);
    console.log("username", username);
    todos.find({
      username: username,
      password: password
    })
  .then(function (user, err) {
    bcrypt.compare(password, user.password, function (err, res) {
      if( err ) {
        throw err;
      } else if( res === true ) {
        return done( null, user);
      } else {
        return done( null, false );
      }
    });
    });
  })
);

function isAuthenticated ( req, res, next ) {
  if( !req.isAuthenticated() ) {
    return res.redirect( 'login' );
  }
  return next();
}

var server = app.listen(PORT, function(){
  console.log("listen on port " + PORT);
});