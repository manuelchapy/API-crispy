const { Router } = require('express');
const Ctrlfacturacion	= require('../controllers/facturacion.controllers');

const router = Router();

router.route('/guardar_factura')
		.post(Ctrlfacturacion.guardarFactura)

router.route('/anularFactura')
		.post(Ctrlfacturacion.anularFactura)

router.route('/buscarFacturaSinPagar/:id_factura')
		.get(Ctrlfacturacion.buscarFacturaSinPagar)

router.route('/buscarFacturaPagada/:id_factura')
		.get(Ctrlfacturacion.buscarFacturaPagada)

router.route('/dividir_factura')
		.post(Ctrlfacturacion.dividirFactura)

router.route('/crear_comanda')
		.post(Ctrlfacturacion.crearComanda)

router.route('/total_factura')
		.post(Ctrlfacturacion.totalFactura)

router.route('/facturasActivas')
		.get(Ctrlfacturacion.facturasActivas)

router.route('/facturasCanceladas')
		.get(Ctrlfacturacion.facturasCanceladas)

router.route('/facturasCreditoActivas')
		.get(Ctrlfacturacion.facturasCreditoActivas)

router.route('/facturasCreditoCanceladas')
		.get(Ctrlfacturacion.facturasCreditoCanceladas)

router.route('/cancelar_factura')
		.post(Ctrlfacturacion.cancelarFactura)

router.route('/eliminarItemDetalleFacturaComanda')
		.post(Ctrlfacturacion.eliminarItemDetalleFacturaComanda)

router.route('/modificarCrearEliminarPago')
		.post(Ctrlfacturacion.modificarCrearEliminarPago)

router.route('/moverFacturasNuevaMesa')
		.post(Ctrlfacturacion.moverFacturasNuevaMesa)



module.exports = router;