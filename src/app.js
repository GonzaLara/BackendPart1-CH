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
app.use(express.urlencoded({extended:true}));

//Se implementan los routers creados (endpoints raiz)
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' http://localhost:8080");
    next();
});

// Para escuchar conexiones entrantes
socketServer.on( 'connection', (socket) => { 
    console.log("Nuevo cliente conectado");

    socket.on("message", data => {
        console.log(data)
    });
})