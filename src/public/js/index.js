const socket = io();

socket.emit('message', 'Me estoy comunicando desde un websocket');

// socket.on('evento_para_socket_individual', data => {
//     console.log(data);
// });

// socket.on('evento_para_todos_menos_el_socket_actual', data => {
//     console.log(data);
// });

// socket.on('evento_para_todos', data => {
//     console.log(data);
// });

// const messageInput = document.getElementById('messageInput');
// const sendMessageButton = document.getElementById('sendMessage');
// const messageContainer = document.getElementById('messageContainer');

// sendMessageButton.addEventListener('click', () => {
//     const message = messageInput.value;
//     socket.emit('newMessage', message);
//     messageInput.value = '';
// });

// socket.on('loadMessages', (messages) => {
//     messages.forEach((message) => {
//         const messageElement = document.createElement('p');
//         messageElement.textContent = `${message.socketid}: ${message.message}`;
//         messageContainer.appendChild(messageElement);
//     });
// });
