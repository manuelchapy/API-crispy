const { Router } = require('express');
const ctrlAdministracionFiscal = require('../controllers/administracionFiscal.controllers');
const router = Router();

router.route('/cierreConsolidado')
		.post(ctrlAdministracionFiscal.cierreConsolidado);

router.route('/resetearOrdenes')
		.get(ctrlAdministracionFiscal.resetearOrdenes);

module.exports = router;