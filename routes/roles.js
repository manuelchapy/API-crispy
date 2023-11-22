const { Router } = require('express');
const CtrRol = require('../controllers/roles.controllers');
const router = Router();

router.route('/roles')
		.get(CtrRol.roles)

router.route('/crearRol')
		.post(CtrRol.crearRol)

router.route('/editarRol')
		.post(CtrRol.editarRol)


module.exports = router;