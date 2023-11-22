const { Router } = require('express');
const CtrlMetodosPago = require('../controllers/metodosPago.controllers');
const router = Router();

router.route('/tiposDePago')
		.get(CtrlMetodosPago.metodosPagos)


module.exports = router;