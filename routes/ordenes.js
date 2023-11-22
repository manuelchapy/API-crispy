const { Router } = require('express');
const ctrlOrden = require('../controllers/ordenes.controllers');
const router = Router();

router.route('/ultimosPedidos')
		.get(ctrlOrden.ultimosPedidos)

module.exports = router;