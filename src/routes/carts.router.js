import { Router } from "express";
import fs from 'fs/promises';
import { readProductsFile } from './products.router.js';

const router = Router();
const cartsFilePath = './carrito.json';

async function readCartsFile() {
    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Función para escribir los carritos al archivo
async function writeCartsFile(carts) {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
}

// Crear nuevo carrito
router.post('/', async (req, res) => {
    const { id, products = [] } = req.body;
    const newCart = { id, products };
    
    const carts = await readCartsFile();
    carts.push(newCart);
    
    await writeCartsFile(carts);
    res.status(201).json(newCart);
});

// Obtener productos del carrito por ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    
    const carts = await readCartsFile();
    const cart = carts.find(carrito => carrito.id === cid);
    
    if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado.' });
    }
    
    res.json(cart.products);
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    
    const carts = await readCartsFile();
    const cart = carts.find(carrito => carrito.id === cid);
    
    if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado.' });
    }
    
    const products = await readProductsFile();
    const product = products.find(prod => prod.id === pid);
    
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    
    const productInCart = cart.products.find(p => p.product === pid);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }
    
    await writeCartsFile(carts);
    res.json(cart);
});

export default router;
