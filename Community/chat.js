

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Chat.js loaded.")

    //** ------- variables ------- **//
    const socket = io();
    const joinBtn = document.querySelector(".join-room");
    const chatroomJoinSection = document.querySelector(".chatroom-join");
    const actualChatroom = document.querySelector(".actual-chatroom");

    const leaveChatBtn = document.getElementById("leave-chat");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById("chat-input");




    //** ------- join chat ------- **//
    

    joinBtn.addEventListener('click', (e) => {
        let username = document.getElementById("account-username").textContent;
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

        chatroomJoinSection.style.display = 'block';
        actualChatroom.style.display = 'none';
    });

    //** ------- submit message ------- **//
    chatForm.addEventListener('submit', (e) => {
        console.log("submitted message")
        e.preventDefault();
        const msg = chatInput.value.trim();

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
            const msgBox = document.createElement("div");
            msgBox.classList.add("msg-box");
            msgBox.innerHTML = `<strong>${data.user}:</strong> ${data.msg}`;

            //* if its your message, or not*/
            if (data.user === document.getElementById("account-username").textContent) {
                msgDiv.classList.add("self"); 
            } else {
                msgDiv.classList.add("other");
            }

            msgDiv.appendChild(msgBox);
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

    //** ------- listens for the join error (if user is already in chatroom) ------- **//
    socket.on("join-error", (msg) => {
        alert(msg);
        chatroomJoinSection.style.display = 'block';
        actualChatroom.style.display = 'none';
    })

});

