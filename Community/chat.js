const socket = io();


//** ------- variables ------- **//
const joinBtn = document.querySelector(".join-btn");
const chatroomJoinSection = document.querySelector(".chatroom-join");
const actualChatroom = document.querySelector(".actual-chatroom");

const leaveChatBtn = document.getElementById("leave-chat");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById("chat-input");

let username = document.getElementById("account-username").textContent;

actualChatroom.style.display = "none";



//** ------- join chat ------- **//

joinBtn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit("join", username);
    chatroomJoinSection.style.display = 'none';
    actualChatroom.style.display = 'block';
});



//** ------- leave chat ------- **//
leaveChatBtn.addEventListener("click", () => {
    socket.disconnect();
    socket.connect();

    chatroomJoinSection.style.display - 'block';
    actualChatroom.style.display = 'none';
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = chatInput.ariaValueMax.trim();
})