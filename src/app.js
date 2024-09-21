import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

// Importar los Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

// Importar el constructor de un servidor de sockets
import { Server } from 'socket.io';

//Inicializar el servidor
const app = express();
const httpServer = app.listen(8080, () => {
    console.log("El servidor esta escuchando.");  // Servidor HTTP
})

// Se crea un servidor de sockets que vive dentro del servidor HTTP
const socketServer = new Server(httpServer);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// La carpeta 'public' es la carpeta de archivos estaticos
app.use(express.static(__dirname + '/public'));

//Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Se implementan los routers creados (endpoints raiz)
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// const messages = [];

// socketServer.on('connection', (socket) => {
//     console.log("Nuevo cliente conectado");

//     socket.on("message", data => {
//         console.log(data)
//     });

//     socket.emit('evento_para_socket_individual', 'Este mensaje solo lo debe recibir el socket');

//     socket.broadcast.emit('evento_para_todos_menos_el_socket_actual', 'Este evento lo verán todos los sockets conectados, menos el socket actual desde el que se envió el mensaje');

//     socketServer.emit('evento_para_todos', 'Este mensaje lo reciben todos los sockets conectados');

//     // Enviar los mensajes existentes al nuevo cliente
//     socket.emit('loadMessages', messages);

//     socket.on('newMessage', (message) => {
//         const newMessage = { socketid: socket.id, message };
//         messages.push(newMessage);
//         socketServer.emit('newMessage', newMessage);
//     });
// });