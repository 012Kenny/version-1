/** 
* Client-side chat system
* recieve info from server and update it in client for chat
*
* 
*
*
*
* 
* 
*/


document.addEventListener("DOMContentLoaded", async () => {
    console.log("Chat.js loaded.")

    //** ------- variables ------- **//
    const socket = io(); // socket.io server
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

        // shows chatroom
        e.preventDefault();
        socket.emit("join", username);
        chatroomJoinSection.style.display = 'none';
        actualChatroom.style.display = 'block';
    });



    //** ------- leave chat ------- **//
    leaveChatBtn.addEventListener("click", () => {
        console.log("left chat")

        // disconnect and reconnects socket, shows ui
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

        // send message to server if msg is valid and clear chat type box
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

        
        if (data.user === "System") { // System messages Join/Leave
            msgDiv.classList.add("system");
            msgDiv.textContent = data.msg;
        } else { // normal user messages
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
        chatMessages.appendChild(msgDiv); // add to chat window
        chatMessages.scrollTop = chatMessages.scrollHeight; // scroll to bottom
    }


    //** ------- SOCKET ------- **//



    //** ------- Recieve chat history ------- **//
    socket.on("chat history", (history) => { // show old msgs
        chatMessages.innerHTML = "";
        history.forEach((msg) => renderMessage(msg));
    });

    //** ------- Recieve new messages ------- **//
    socket.on("chat message", (data) => { // new msgs
        renderMessage(data);
    });

    //** ------- Clear chat when everyone leaves ------- **//
    socket.on("clear chat", () => {
        chatMessages.innerHTML = "";
    });

    //** ------- listens for the join error (if user is already in chatroom) ------- **//
    socket.on("join-error", (msg) => { // show error and hide chatroom and show join btn
        alert(msg);
        chatroomJoinSection.style.display = 'block';
        actualChatroom.style.display = 'none';
    })

});

