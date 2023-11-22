const { Router } = require('express');
const ctrlDelivery = require('../controllers/delivery.controllers');
const router = Router();

router.route('/deliverys')
		.get(ctrlDelivery.deliverys)

module.exports = router;