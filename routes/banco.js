const { Router } = require('express');
const ctrlBanco = require('../controllers/banco.controllers');
const router = Router();

router.route('/bancos')
		.get(ctrlBanco.bancos)

module.exports = router;