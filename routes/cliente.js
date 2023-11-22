const { Router } = require('express');
const ctrlCliente = require('../controllers/cliente.controllers');
const router = Router();

router.route('/clientes')
		.get(ctrlCliente.clientes)

router.route('/agregarCliente')
		.post(ctrlCliente.agregarCliente)

router.route('/verificarCliente')
		.post(ctrlCliente.verificarCliente)

router.route('/modificarCliente')
		.post(ctrlCliente.modificarCliente)

router.route('/documentos')
		.get(ctrlCliente.documentos)



module.exports = router;