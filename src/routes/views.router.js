import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {}); // Renderiza la vista 'index', no se pasan objetos
});

export default router;
