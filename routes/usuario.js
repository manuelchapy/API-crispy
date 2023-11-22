const { Router } = require('express');
const CtrlUsuario = require('../controllers/usuario.controllers');
const router = Router();

router.route('/crearUsuario')
		.post(CtrlUsuario.crearUsuario)

router.route('/login')
		.post(CtrlUsuario.login)

router.route('/logout')
		.post(CtrlUsuario.logout)

router.route('/usuarios')
		.get(CtrlUsuario.usuarios)

router.route('/buscarUsuario/:id_usuario')
		.get(CtrlUsuario.buscarUsuario)

router.route('/buscarUsuario/:id_usuario')
		.get(CtrlUsuario.buscarUsuario)

router.route('/modificarUsuario')
		.post(CtrlUsuario.modificarUsuario)

router.route('/adminSesiones')
		.post(CtrlUsuario.adminSesiones)

router.route('/verificarToken')
		.post(CtrlUsuario.verificarToken)

router.route('/checkPasswordAnularItemPedido')
		.post(CtrlUsuario.checkPasswordAnularItemPedido)

router.route('/checkPasswordAnularFactura')
		.post(CtrlUsuario.checkPasswordAnularFactura)


module.exports = router;