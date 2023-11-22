const { Router } = require('express');
const ctrlCategoria = require('../controllers/categoria.controllers');
const router = Router();

router.route('/categorias')
		.get(ctrlCategoria.categorias)

module.exports = router;