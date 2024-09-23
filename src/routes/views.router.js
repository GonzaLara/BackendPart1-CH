import express from 'express';
import { readProductsFile } from './products.router.js'; // Asegúrate de tener esta función

const router = express.Router();

// Renderiza la vista 'index', no se pasan objetos
router.get('/', (req, res) => {
    res.render('index', {});
});

// Renderizar la vista 'home' con todos los productos
router.get('/home', async (req, res) => {
    const products = await readProductsFile();
    res.render('home', { products });
});

// Renderizar la vista 'realTimeProducts' con todos los productos
router.get('/realtimeproducts', async (req, res) => {
    const products = await readProductsFile();
    res.render('realTimeProducts', { products });
});

export default router;