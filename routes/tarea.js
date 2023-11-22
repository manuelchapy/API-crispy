const { Router } = require('express');
const CtrTarea = require('../controllers/tareas.controllers');
const router = Router();

router.route('/tareas')
		.get(CtrTarea.tareas)

router.route('/crearTarea')
		.post(CtrTarea.crearTarea)

router.route('/editarTarea')
		.post(CtrTarea.editarTarea)

router.route('/tareasRol')
		.post(CtrTarea.tareasRol)


module.exports = router;