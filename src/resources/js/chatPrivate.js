//const chatForm = document.getElementById('chat-form');
let socket = io();
const moment = require('moment');
let userName = document.getElementById('userName').value;
let email = document.getElementById('userEmail').value;
let id = document.getElementById('userID').value;
const formChat = document.getElementById("chat-form");
const input_chat = document.getElementById("msg");
const viewChat = document.getElementById("messages");
const usersOnline = document.getElementById("user-online");
const chatMain = document.getElementById("chatMain");
const bgRight = document.getElementById("bg-right");
const conversation = document.getElementById("conversation");
const userNameChat = document.getElementById("userNameChat");
const avataUserPrivate = document.getElementById("avata-user-private");
const notification = document.getElementById("notification");
var idUserInBtn;
let user = {
    userName,
    email,
    id
};

function fetchShowConversation(roomId) {
    fetch('/conversation', {
            method: 'POST',
            body: JSON.stringify({ roomId: roomId }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((res) => {
            return res.json();
        })
        .then(data => {
            conversation.classList.remove('none');
            bgRight.classList.add('none');
            //hien tin nnhan ra man hinh nguoi dung
            let msgs = data;
            console.log(msgs.length);

            viewChat.innerHTML = "";
            input_chat.value = "";
            if (msgs.length != 0) {
                for (let i = 0; i < msgs.length; i++) {
                    let message = document.createElement('div');
                    message.classList.add('chat-message"');
                    if (msgs[i].sender === id) {
                        message.innerHTML = ` 
                        <div class="flex items-end justify-end">
                           <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                              <div class="flex">
                              <span class="block text-xs text-left pt-3 pr-1 text-gray-300">  ${ moment(msgs[i].createdAt).format("h:mm a") }</span>
                              <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">${msgs[i].content}</span>
                              </div>
                           </div>
                        </div>
                     `;
                        viewChat.appendChild(message);
                    } else {
                        let message = document.createElement('div');
                        message.classList.add('chat-message"');
                        message.innerHTML = `
                        <div class="flex items-end ">
                           <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                              <div class="flex">
                                 <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">${msgs[i].content}</span>
                                 <span class="block text-xs text-left text-gray-300 pt-3 pl-1 "> ${ moment(msgs[i].createdAt).format("h:mm a") }</span>
                              </div>
                           </div>
                        </div>   
                     `;
                        viewChat.appendChild(message);
                    }
                }
            }

        })
        .catch((err) => {
            console.log(err)
        })
}
socket.emit('join', user);

socket.on('userNameOnline', function(data) {
    data.usersName.splice(data.usersName.indexOf(userName), 1);
    data.usersId.splice(data.usersId.indexOf(id), 1);

    var userList = '';
    for (var i = 0; i < data.usersName.length; i++) {
        userList += `<button type="button" class="userStatus flex block w-full justify-start items-center text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2" data-id="${data.usersId[i]}">
                     <span class="bg-green-400 h-2 w-2 m-2 rounded-full"></span>
                     <div class="flex-grow text-left font-medium px-2">${ data.usersName[i]}</div>
                  </button>
                  `;
    };
    usersOnline.innerHTML = userList;
    // console.log(data.usersName);
    let userListStatus = document.querySelectorAll('.userStatus');
    for (let btn = 0; btn < userListStatus.length; btn++) {
        userListStatus[btn].addEventListener("click", function() {
            idUserInBtn = userListStatus[btn].getAttribute("data-id");

            var nameRoom = `${id}--with--${idUserInBtn}`;
            let split = nameRoom.split('--with--');
            let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
            let updatedRoomName = `${unique[0]}--with--${unique[1]}`;
            socket.emit('joinRoomPrivate', updatedRoomName);
            fetchShowConversation(updatedRoomName);

            // input_chat.addEventListener("focusin", function() {
            //     socket.emit('Someone writting');
            // })
            // input_chat.addEventListener("focusout", function() {
            //     socket.emit('Someone writted');
            // })

            socket.emit('getInfoUserPrivateToServer', { id: idUserInBtn });
            socket.on('getInfoUserPrivateToClient', function(data) {
                userNameChat.innerHTML = data.name;
                avataUserPrivate.setAttribute('src', data.avata);
            });

        })

    }
});
formChat.addEventListener('submit', function(even) {
    even.preventDefault();

    socket.emit('emitMessage', { idTo: idUserInBtn, senderId: id, message: input_chat.value });
    // fetchShowConversation(updatedRoomName);
    let message_sendView = document.createElement('div');
    message_sendView.classList.add('chat-message"');
    message_sendView.innerHTML = ` 
        <div class="flex items-end justify-end">
            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">${input_chat.value}</span></div>
            </div>
        </div>
    `;
    viewChat.appendChild(message_sendView);
    console.log(message_sendView);
    input_chat.value = "";
});
socket.on('new_msg', function(data) {
    let message_sendYourFriend = document.createElement('div');
    message_sendYourFriend.classList.add('chat-message"');
    message_sendYourFriend.innerHTML = `
    <div class="flex items-end">
       <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div class="flex ">
             <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">${data.msg}</span>
             </div>
       </div>
    </div>      
 `;
    viewChat.appendChild(message_sendYourFriend);
});