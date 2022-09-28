var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const firebase = require('firebase-admin');
var fs = require('fs');
app.set('view engine', 'ejs');
var serviceAccount = JSON.parse(fs.readFileSync("./functions/config/service-account-file.json"));

const firebaseConfig = {    
    credential: firebase.credential.cert(serviceAccount),
    apiKey: "AIzaSyCqRYLVgb1UFO7MEpuTHpRMyzXYg27h8k0",
    authDomain: "antntrung.firebaseapp.com",
    projectId: "antntrung",
    storageBucket: "antntrung.appspot.com",
    messagingSenderId: "31507933209",
    appId: "1:31507933209:web:dfcde22a5136a1fb8c2288",
    measurementId: "G-ZGHPXP2XQL"
  };
firebase.initializeApp(firebaseConfig);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');  
});

app.get('/home', function(req, res){
  // var name = 'hello';
  // res.render(__dirname + '/home', {name:name});
  // res.sendFile(__dirname + '/home.ejs', {"ahihia": "dsad"});  

  res.render('home.ejs');
  
});

io.on('connection', function(socket){
  socket.on('delUser', function(uid){
    firebase.auth().deleteUser(uid)
    .then(() => {
      firebase.auth()
      .listUsers(1000)
      .then((listUsersResult) => {
          socket.emit("newData", {user: listUsersResult.users});
      })
      .catch((error) => {});
    })
    .catch((error) => {});
  });

  socket.on('enable', function(data){
    firebase.auth().updateUser(data.uid, {
      disabled: !data.enable,
    })
    .then((userRecord) => {
      firebase.auth()
      .listUsers(1000)
      .then((listUsersResult) => {
          socket.emit("newData", {user: listUsersResult.users});
      })
      .catch((error) => {});
    })
    .catch((error) => {});
  });

  socket.on('getData', function(){
    firebase.auth()
      .listUsers(1000)
      .then((listUsersResult) => {
          socket.emit("newData", {user: listUsersResult.users});
      })
      .catch((error) => {});
  });

  socket.on('infoLogin', function(login){
      if (login.user == 'admin' && login.password == 'admin') {
        socket.emit("nextHome", true);
      } else {
        socket.emit("nextHome", false);
      }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});