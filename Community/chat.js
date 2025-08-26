const socket = io();

document.addEventListener("DOMContentLoaded", async () => {
    //** ------- variables ------- **//
    const joinBtn = document.querySelector(".join-btn");
    const chatroomJoinSection = document.querySelector(".chatroom-join");
    const actualChatroom = document.querySelector(".actual-chatroom");

    const leaveChatBtn = document.getElementById("leave-chat");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById("chat-input");

    let username = document.getElementById("account-username").textContent;



    //** ------- join chat ------- **//
    

    joinBtn.addEventListener('click', (e) => {
        console.log("joined chat")
        e.preventDefault();
        socket.emit("join", username);
        chatroomJoinSection.style.display = 'none';
        actualChatroom.style.display = 'block';
    });



    //** ------- leave chat ------- **//
    leaveChatBtn.addEventListener("click", () => {
        console.log("left chat")
        socket.disconnect();
        socket.connect();

        chatroomJoinSection.style.display - 'block';
        actualChatroom.style.display = 'none';
    });

    //** ------- submit message ------- **//
    chatForm.addEventListener('submit', (e) => {
        console.log("submitted message")
        e.preventDefault();
        const msg = chatInput.ariaValueMax.trim();

        if (msg) {
            socket.emit("chat message", msg);
            chatInput.value = "";
        }
    });

    //** ------- render messages ------- **//

    function renderMessage(data) { // render msg function

        // makes message //
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        // ------------ //

        
        if (data.user === "System") {
            msgDiv.classList.add("system");
            msgDiv.textContent = data.msg;
        } else {
            msgDiv.innerHTML = `<strong>${data.user}:</strong> ${data.msg}`;
        }
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    //** ------- SOCKET ------- **//



    //** ------- Recieve chat history ------- **//
    socket.on("chat history", (history) => {
        chatMessages.innerHTML = "";
        history.forEach((msg) => renderMessage(msg));
    });

    //** ------- Recieve new messages ------- **//
    socket.on("chat message", (data) => {
        renderMessage(data);
    });

    //** ------- Clear chat when everyone leaves ------- **//
    socket.on("clear chat", () => {
        chatMessages.innerHTML = "";
    });

});

