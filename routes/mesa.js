const { Router } = require('express');
const CtrlMesa = require('../controllers/mesa.controllers');
const router = Router();

router.route('/mesas')
		.get(CtrlMesa.mesas)

router.route('/mesa')
		.post(CtrlMesa.mesa)


module.exports = router;