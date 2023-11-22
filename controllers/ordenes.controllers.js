const OrdenCtrl = {};
const dbFunctionsOrdenes = require('../src/functions/DB_functions_pedidos')

OrdenCtrl.ultimosPedidos = async(req, res) =>{
    ///////CONFIG ULTIMOS 5////////////////
    let facturas = await dbFunctionsOrdenes.listaDeFacturasRecientes();
    console.log(facturas)
    //let idFacturas = facturas.map(({id_factura}) => id_factura);;
    let pedidos = await dbFunctionsOrdenes.pedidoRecientePorFacturas(facturas);
    let pedidosArray = [].concat(...pedidos)
    res.send(pedidosArray);
}   

module.exports = OrdenCtrl;