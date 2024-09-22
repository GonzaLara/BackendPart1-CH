import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

// Importar los Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

// Importar el constructor de un servidor de sockets
import { Server } from 'socket.io';

// Inicializar el servidor
const app = express();
const httpServer = app.listen(8080, () => {
    console.log("El servidor esta escuchando.");  // Servidor HTTP
})

// Se crea un servidor de sockets que vive dentro del servidor HTTP
// const socketServer = new Server(httpServer);
const io = new Server(httpServer);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// La carpeta 'public' es la carpeta de archivos estaticos
app.use(express.static(__dirname + '/public'));

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Se implementan los routers creados
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);


/* Chat Comunitario */
let messages = [];  //Los mensajes se almacenarán aquí

io.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    //Escuchar del servidor los mensajes emitidos con eventos o etiquetas 'message'
    socket.on('message', (data) => {// Escuchamos el evento con el mismo nombre que el emit del cliente messages
        messages.push(data); //Guardamos el objeto en la "base"
        io.emit('messageLogs', messages); //Reenviamos instántaneamente los logs actualizados
    });

    socket.on('userAuthenticated', user => {
        //Emitir los logs del chat AL USUARIO que se acaba de autenticar
        socket.emit('messageLogs', messages);

        //Emitir una notificación a todos los demás usuarios
        socket.broadcast.emit('newUserConnected', user);
    });
})

/* FIN Chat Comunitario */