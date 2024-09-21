import { Router } from "express";
import fs from 'fs/promises';  // Importar fs con promesas
import path from 'path';

const router = Router();
const productsFilePath = path.resolve('productos.json');

// Función para leer los productos desde el archivo
export const readProductsFile = async () => {
   try {
       const data = await fs.readFile(productsFilePath, 'utf-8');
       return JSON.parse(data); // Convertir de JSON a objeto
   } catch (error) {
       console.error('Error al leer el archivo de productos:', error);
       return []; // Devolver un array vacío si hay un error
   }
};

export let products = await readProductsFile();

// Función para escribir los productos al archivo
async function writeProductsFile(products) {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
}

// Obtener todos los productos
router.get('/', async (req, res) => {
    const products = await readProductsFile();
    res.json(products);
});

// Obtener producto por ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await readProductsFile();
    const product = products.find(prod => prod.id === pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado.' });
    }
});

// Agregar nuevo producto
router.post('/', async (req, res) => {
    const { id, title, description, code, price, status, stock, category } = req.body;
    
    if (!id || !title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ message: 'Completar todos los campos.' });
    }
    
    const products = await readProductsFile();
    const existingProduct = products.find(prod => prod.id === id || prod.code === code);
    
    if (existingProduct) {
        return res.status(400).json({ message: 'Ya existe un producto con ese ID.' });
    }
    
    const newProduct = { id, title, description, code, price, status, stock, category };
    products.push(newProduct);
    
    await writeProductsFile(products);
    res.status(201).json(newProduct);
});

// Actualizar producto por ID
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { id, ...updatedFields } = req.body;
    
    const products = await readProductsFile();
    const productIndex = products.findIndex(prod => prod.id === pid);
    
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        await writeProductsFile(products);
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Producto no encontrado.' });
    }
});

// Eliminar producto por ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    
    const products = await readProductsFile();
    const productIndex = products.findIndex(prod => prod.id === pid);
    
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await writeProductsFile(products);
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Producto no encontrado.' });
    }
});

export default router;
