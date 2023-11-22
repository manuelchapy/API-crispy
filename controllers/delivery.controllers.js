const deliveryCtrl = {};
const dbFunctionsDelivery = require("../src/functions/DB_functions_deliverys");
const dbFunctionsGenericos = require("../src/functions/DB_functions_genericos");

deliveryCtrl.deliverys = async(req, res) =>{
    let facturas = await dbFunctionsDelivery.facturasActivasDeliverys();
    if(facturas.length > 0){
        let idFacturas = facturas.map(({id_factura}) => id_factura);
        let ordenesFacturas = await dbFunctionsGenericos.buscarOrdenesPorFacturas(idFacturas);
        console.log(idFacturas)
        let registrosFactura = await  dbFunctionsGenericos.registrosItemsPorFactura(idFacturas);
        console.log()
        facturas.map(factura => factura.items = [])
        facturas.forEach(factura => {
            for(const orden of ordenesFacturas){
                if(factura.id_factura == orden.id_factura){
                    factura.orden_numero = orden.orden_numero
                }
            }
            for(const item of registrosFactura){
                if(factura.id_factura == item.id_factura){
                    factura.items.push(item);
                }
            }
        })
        res.send(facturas);
    }else{
        res.send([])
    }

}


module.exports = deliveryCtrl;