const socket = io();

const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const chatMessage = document.querySelector(".chat-messages");
const Message = document.querySelector(".message");

var audio = new Audio("./music/tone.mp3")

// Get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


// Join chatroom
socket.emit('joinRoom', {username, room})

// Message from server
socket.on('message', (msg) => {
    console.log(msg);

    // Text right for me
        if(msg.username === username) {
            outputMessageForMe(msg);
        }else{
            audio.play();
            outputMessageForAnother(msg);
        }
  

    //Scrool down
    chatMessage.scrollTop = chatMessage.scrollHeight;

});

// Get Room and Users
socket.on('roomUsers', ({room, users}) => {
    roomName.innerText = room;

     userList.innerHTML = `
     ${users.map( user => `<li>${user.username}</li>`).join('')}` 


})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();
})


// Output message to DOM
function outputMessageForMe(message) {
    const div = document.createElement("div");
    div.classList.add("message_me");
    div.innerHTML= `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`
    document.querySelector(".chat-messages").appendChild(div);
}
function outputMessageForAnother(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML= `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`
    document.querySelector(".chat-messages").appendChild(div);
}