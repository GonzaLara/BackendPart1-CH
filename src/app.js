import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

// Importar los Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

import { readProductsFile, writeProductsFile } from './routes/products.router.js';

// Importar el constructor de un servidor de sockets
import { Server } from 'socket.io';

// Inicializar el servidor
const app = express();
const httpServer = app.listen(8080, () => {
    console.log("El servidor esta escuchando.");
})

// Se crea un servidor de sockets que vive dentro del servidor HTTP
const io = new Server(httpServer);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine({
     defaultLayout: 'main',
    partialsDir: __dirname + '/views'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.set('socketio', io);

// La carpeta 'public' es la carpeta de archivos estaticos
app.use(express.static(__dirname + '/public'));

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Se implementan los routers creados
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// Configurar el servidor de sockets
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Creacion de un producto
    socket.on('createProduct', async (productData) => {
        const products = await readProductsFile();

        const newProduct = {
            id: (products.length + 1).toString(),
            ...productData
        };

        products.push(newProduct);
        await writeProductsFile(products);

        // Evento para agregar el producto a todos los clientes conectados
        io.emit('productAdded', newProduct);
    });

    // Eliminacion de un producto
    socket.on('deleteProduct', async (productId) => {
        let products = await readProductsFile();
        const productIndex = products.findIndex(prod => prod.id === productId);

        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            await writeProductsFile(products);

            // Evento para eliminar el producto a todos los clientes conectados
            io.emit('productDeleted', productId);
        }
    });
});