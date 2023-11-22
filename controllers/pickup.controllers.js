const pickupCtrl = {};
const dbFunctionsPickups = require("../src/functions/DB_function_pickups");
const dbFunctionsGenericos = require("../src/functions/DB_functions_genericos");

pickupCtrl.pickups = async(req, res) =>{
    let facturas = await dbFunctionsPickups.facturasActivasPickups();
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
        console.log("!!!!!!!!", facturas)
        res.send(facturas);
    }else{
        res.send([])
    }

}


module.exports = pickupCtrl;