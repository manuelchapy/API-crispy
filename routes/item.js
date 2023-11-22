const { Router } = require('express');
const Ctrlitem = require('../controllers/item.controllers');

const router = Router();

router.route('/items')
		.get(Ctrlitem.items)

router.route('/buscarItem/:id_item')
		.get(Ctrlitem.buscarItem)

router.route('/itemsPorCategoria')
		.get(Ctrlitem.itemsPorCategoria)

router.route('/itemsAnulados')
		.get(Ctrlitem.itemsAnulados)

router.route('/crearItem')
		.post(Ctrlitem.crearItem)

router.route('/modificarItem')
		.post(Ctrlitem.modificarItem)

router.route('/anularItem')
		.post(Ctrlitem.anularItem)

router.route('/activarItem')
		.post(Ctrlitem.activarItem)




module.exports = router;

