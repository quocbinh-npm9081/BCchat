require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
//const server = require("http").createServer(app);
const expressLayouts = require('express-ejs-layouts');
const route = require('./routes/index');
const flash = require('express-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const DB = require('./app/config/mongoDB/index');
const passport = require('passport');
const methodOverride = require('method-override');
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.setMaxListeners(50);
//const cors = require('cors');
const initPassport = require('./app/config/passport/index');
const userModel = require('./app/models/user');
const messageModel = require('./app/models/message');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, './resources/views'));
//connect mongoB
DB.connect();

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/BCchat',
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24
}))
app.use(flash());
//PASSPORT MIDDLEWARE
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

//Global 
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});
route(app);




const port = 4000 || process.env.PORT;
let server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const io = require('socket.io')(server);

var users = {};
io.sockets.on('connection', (socket) => {
    //socket.adapter.rooms // return rooms in socket
    // console.log(socket.adapter.rooms); //Check ROOMS in socketIO
    var userId;
    socket.on('join', (data, callback) => {
        userId = data.id;
        socket.userId = userId;
        // userModel.updateOne({ _id: userId }, { status: 1 }, (err, user) => {
        //     if (err) throw err
        // });
        console.log(data.userName + ' CONNECTED WITH SOCKET ID: ' + socket.id);

        if (data in users) {
            // callback(true);
            updateUserOnline();
        } else {
            socket.userName = data.userName;
            users[userId] = socket.userName;
            updateUserOnline();
            //console.log(users);
        }
        socket.on('joinRoomPrivate', function(nameRoom) {
            Array.from(socket.rooms)
                .filter(it => it !== socket.id)
                .forEach(id => {
                    socket.leave(id);
                    socket.removeAllListeners('emitMessage');
                });
            socket.join(nameRoom);
            //console.log(socket.adapter.rooms);
            socket.on('emitMessage', data => {
                const message = data.message.trim();
                Array.from(socket.rooms)
                    .filter(it => it != socket.id)
                    .forEach(id => {
                        // userModel.findById(data.idForm, function(err, user) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {

                        //     }
                        // })
                        const new_msg = new messageModel({
                            roomId: nameRoom,
                            content: message,
                            sender: data.senderId,
                            from: data.idTo,
                        })
                        new_msg.save();
                        socket.to(id).emit('new_msg', { msg: message });
                        // socket.on('Someone writting', function() {
                        //     socket.to(id).emit('writting');
                        // });
                        // socket.on('Someone writted', function() {
                        //     //  console.log(socket.userName + "writted...");
                        //     socket.to(id).emit('writted');
                        // });
                    })
            })
        })
        socket.on('getInfoUserPrivateToServer', function(data) {
            userModel.findById(data.id, function(err, user) {
                if (err) {
                    console.log(err);
                } else {
                    //io.sockets.in(data.id).emit('new_msg', { msg: message, userName: user.name, avata: user.avata });
                    //socket.broadcast.emit("newMessage", message);
                    socket.emit('getInfoUserPrivateToClient', user);
                }
            })
        })


    });


    function updateUserOnline() {
        // console.log(Object.values(users));
        io.sockets.emit('userNameOnline', { usersName: Object.values(users), usersId: Object.keys(users) });
    }
    socket.on("disconnect", (data) => {
        if (!socket.userName) {
            return;
        } else {
            console.log("Disconnected");
            userModel.updateOne({ _id: userId }, { status: 0 }, (err, user) => {
                if (err) throw err
            });
            delete users[userId];
            updateUserOnline();
            socket.removeAllListeners();

            // console.log(socket);
        }
    });
});