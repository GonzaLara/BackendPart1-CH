// Archivo para conectarse con el servidor, desde el lado del cliente
const socket = io();

// socket.emit('message', 'Me estoy comunicando desde un websocket');

/* Chat Comunitario */
let user;
let chatBox = document.getElementById('chatbox');

Swal.fire({
    title: "Identificate",
    input: 'text',  //el cliente tiene que escribir un texto para avanzar
    text: "Ingresa tu usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre de usuario para continuar'
    },
    allowOutsideClick: false,   //impide que el usuario salga de la alerta al hacer click fuera de la alerta
}).then(result => {
    user = result.value;
    document.getElementById('username').textContent = user;
    socket.emit('userAuthenticated', {user: user})
});

// Event listener para el input del chat
chatBox.addEventListener('keyup', (evt) => {
    if (evt.key === 'Enter') {  //El mensaje se enviará cuando el usuario apriete "Enter" en la caja de chat
        if (chatBox.value.trim().length) {  //Corroboramos que el mensaje no esté vacío o sólo contenga espacios.
            socket.emit('message', {user: user, message : chatBox.value}); //Emitimos nuestro primer evento.
            chatBox.value = '';
        }
    }
})

//Escuchar el evento 'messageLogs' en el cliente y actualizara la lista de mensajes
socket.on('messageLogs', (data) => {
    let log = document.getElementById('messageLogs');
    let messagesHtml = "";
    data.forEach(message => {
        messagesHtml += `${message.user} dice: ${message.message}<br>`;
    });
    log.innerHTML = messagesHtml;
})

//Escuchar si se conecta un usuario nuevo
socket.on('newUserConnected', newUser => {
    // Mostrar una notificación usando SweetAlert2
    Swal.fire({
        text:"Nuevo usuario conectado",
        toast: true,
        position: 'top-right',
        icon: 'info',
        title: `${newUser.user} se ha unido al chat`,
        showConfirmButton: false,
        timer: 5000
    });
});

/* FIN Chat Comunitario */