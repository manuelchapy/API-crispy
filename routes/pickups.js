const { Router } = require('express');
const ctrlPickup = require('../controllers/pickup.controllers');
const router = Router();

router.route('/pickups')
		.get(ctrlPickup.pickups)

module.exports = router;