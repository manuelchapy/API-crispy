const { Router } = require('express');
const ctrlDivisa = require('../controllers/divisa.controllers');
const router = Router();

router.route('/divisas')
		.get(ctrlDivisa.divisas)

router.route('/registroDivisas')
		.get(ctrlDivisa.registroDivisas)

router.route('/historialDivisas')
		.post(ctrlDivisa.historialDivisas)

router.route('/agregar_divisa')
		.post(ctrlDivisa.agregarDivisa)

router.route('/agregarTasaDivisa')
		.post(ctrlDivisa.agregarTasaDivisa)

module.exports = router;