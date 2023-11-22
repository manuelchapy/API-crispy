const facturacionCtrl = {};
const dbFunctionsFactura= require('../src/functions/DB_functions_facturacion');
const dbFunctionsFacturaData = require('../src/functions/functions_data_facturacion');
const dbFunctionsDivisas = require('../src/functions/DB_functions_divisas');
const dbFunctionsGenericos = require('../src/functions/DB_functions_genericos')
const { debe_dolares, total_pesos, total_dolares, tasa_pesos_dia, tasa_bolivar_dia } = require('../src/models/models_DB/factura');

facturacionCtrl.facturasActivas = async(req, res) =>{
    let facturas = await dbFunctionsFactura.facturasActivas()
    res.send(facturas)
}

facturacionCtrl.anularFactura = async(req, res) =>{
    let resp = await dbFunctionsFactura.anularFactura(req.body.id_factura)
    res.send(resp)
}

facturacionCtrl.facturasCanceladas = async(req, res) =>{
    let facturas = await dbFunctionsFactura.facturasCanceladas()
    res.send(facturas)
}

facturacionCtrl.facturasCreditoActivas = async(req, res) =>{
    let facturas = await dbFunctionsFactura.facturasCreditoActivas()
    res.send(facturas)
}

facturacionCtrl.facturasCreditoCanceladas = async(req, res) =>{
    let facturas = await dbFunctionsFactura.facturasCreditoCancelada()
    res.send(facturas)
}

facturacionCtrl.guardarFactura = async(req, res) =>{
    let recibo, idFactura;
    recibo = await dbFunctionsFactura.guardarFactura(req.body.datos_generales);

    if(recibo.tipo == 2){
        idFactura = await dbFunctionsFactura.extraerIdOrdenTrabajo(recibo.numero);
    }else{
        idFactura = await dbFunctionsFactura.extraerIdFactura(recibo.numero);
    }
    
    await dbFunctionsFactura.guardarDetallesFacturaItem(idFactura, req.body.items);
    //await dbFunctionsFactura.guardarRegistrosPagos(idFactura, req.body.pagos);
    await dbFunctionsFactura.crearComanda(idFactura);
    res.send(
        '1'
    )
};

facturacionCtrl.dividirFactura = async(req, res) =>{
    console.log(req.body)
    let recibo, idFactura;
    recibo = await dbFunctionsFactura.guardarFactura(req.body.datos_generales);
    if(recibo.tipo == 2){
        idFactura = await dbFunctionsFactura.extraerIdOrdenTrabajo(recibo.numero);
    }else{
        idFactura = await dbFunctionsFactura.extraerIdFactura(recibo.numero);
    }
    await dbFunctionsFactura.cambiarDetalleFacturaItems(req.body.items, idFactura)
    res.send(
        '1'
    )
}

facturacionCtrl.crearComanda = async(req, res) =>{
    await dbFunctionsFactura.guardarDetallesFacturaItem(req.body.id_factura, req.body.items);
    await dbFunctionsFactura.crearComanda(req.body.id_factura);
    res.send("1")
}

facturacionCtrl.totalFactura = async(req, res) =>{
    let itemsFactura = await dbFunctionsFactura.extraerItemsFactura(req.body.id_factura)
    let datosFactura = await dbFunctionsFactura.extraerFactura(req.body.id_factura)
    let itemsAgrupados = await dbFunctionsFacturaData.agruparItemsTotalFactura(itemsFactura);
    let registroDivisas = await dbFunctionsDivisas.registroDivisas()
    let divisaB, divisaP;
    itemsAgrupados = Object.values(itemsAgrupados);
    console.log(registroDivisas)
    let datos = {}, total_dolares = 0, total_pesos = 0, total_bolivares = 0;

    itemsAgrupados.forEach(item => {
        total_dolares += item.item_precio;
    });
    registroDivisas.forEach(registro => {
        if(registro.id_divisa == 2){
            divisaP = registro.tasa_actual;
        }
        if(registro.id_divisa == 3){
            divisaB = registro.tasa_actual;
        }
    })

    datos.items_factura = itemsAgrupados;
    datos.datos_factura = datosFactura;
    datos.totales = {
        total_pesos: total_dolares * divisaP,
        total_dolares: total_dolares,
        total_bolivares: total_dolares * divisaB
    }
    res.send(datos)


}

facturacionCtrl.cancelarFactura = async(req, res) =>{

    let modificacion = {};
    if(req.body.id_tipo_factura == 4){
            modificacion = {
                id_factura: req.body.id_factura,
                id_tipo_factura: req.body.id_tipo_factura,
                debe_dolares: req.body.debe_dolares,
                total_bolivares: req.body.total_bolivares,
                total_pesos: req.body.total_pesos,
                total_dolares: req.body.total_dolares,
                tasa_pesos_dia: req.body.tasa_pesos_dia,
                tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                referencia: req.body.referencia
            }
    }else if(req.body.id_tipo_factura == 3){
            modificacion = {
                id_factura: req.body.id_factura,
                id_tipo_factura: req.body.id_tipo_factura,
                id_cliente: req.body.id_cliente,
                tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                tasa_pesos_dia: req.body.tasa_pesos_dia,
                total_pesos: req.body.total_pesos,
                total_dolares: req.body.total_dolares,
                total_bolivares: req.body.total_bolivares
            }
    }else{
            modificacion = {
                id_factura: req.body.id_factura,
                id_tipo_factura: req.body.id_tipo_factura,
                id_cliente: req.body.id_cliente,
                debe_dolares: req.body.debe_dolares,
                tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                tasa_pesos_dia: req.body.tasa_pesos_dia,
                total_pesos: req.body.total_pesos,
                total_dolares: req.body.total_dolares,
                total_bolivares: req.body.total_bolivares
            }
    }
    await dbFunctionsFactura.cancelarFactura(modificacion)
    if(req.body.id_tipo_factura != 4){
        await dbFunctionsFactura.guardarRegistrosPagos(req.body.id_factura, req.body.pagos);
    }
    res.send("1");
}

facturacionCtrl.moverFacturasNuevaMesa = async(req, res) =>{
    let facturas = await dbFunctionsFactura.facturasActivasPorMesa(req.body.id_mesa_act);
    let idMesa = await dbFunctionsFactura.buscarMesa(req.body.numero);
    console.log(facturas)
    let resp = await dbFunctionsFactura.moverFacturasANuevaMesa(idMesa[0].id_mesa, facturas)
    res.send(resp)
}

facturacionCtrl.eliminarItemDetalleFacturaComanda = async(req, res) =>{
    let respDO = await dbFunctionsGenericos.eliminarDetalleOrden(req.body.id_detalle_factura_item);
    if(respDO == "1"){
        let respDF = await dbFunctionsGenericos.eliminarDetalleFacturaPaciente(req.body.id_detalle_factura_item);
        if(respDF == "1"){
            res.send(respDF)
        }else{
            res.send(respDF)
        }
    }else{
        res.send("-1")
    }
}

facturacionCtrl.buscarFacturaSinPagar = async(req, res) =>{
    try{
        const {id_factura} = req.params;
        console.log(id_factura)
        const factura = await dbFunctionsFactura.extraerFactura(id_factura);
        const items = await dbFunctionsFactura.extraerItemsFactura(id_factura);
        res.send({
            detalles_factura: factura[0],
            items: items
        });
    }catch{res.send("0")}
}

facturacionCtrl.buscarFacturaPagada = async(req, res) =>{
    try{
        const {id_factura} = req.params;
        console.log(id_factura)
        const factura = await dbFunctionsFactura.extraerFactura(id_factura);
        const items = await dbFunctionsFactura.extraerItemsFactura(id_factura);
        const pagos = await dbFunctionsGenericos.extrearPagos(id_factura);
        pagos.map(pago => {
            pago.tipo_registro = pago.tipo_registro.toString()
            pago.accion = 2
            pago.agregado = "1"
        })
        res.send({
            detalles_factura: factura[0],
            items: items,
            pagos: pagos
        });
    }catch{res.send("0")}
}

facturacionCtrl.modificarCrearEliminarPago = async(req, res) =>{
    const id_factura = req.body.id_factura;
    const agregar_modificar = req.body.agregar_modificar;
    const eliminar_pagos = req.body.eliminar_pagos;
    
    //console.log(agregar_modificar)
    const pagosModificar = agregar_modificar.filter(pago => pago.accion == 2)
    const pagosCrear = agregar_modificar.filter(pago => pago.accion == 1)
    if(pagosModificar.length > 0){
       const resp = await dbFunctionsFactura.modificarPago(pagosModificar);
       if(resp == "3"){
            res.send("3");
       }
    }
    if(pagosCrear.length > 0){
        const resp = await dbFunctionsFactura.guardarRegistrosPagos(id_factura, pagosCrear)
        if(resp == "3"){
            res.send("3");
       }
    }
    if(eliminar_pagos.length > 0){
        const resp = id_pagos_eliminar = eliminar_pagos.map(({id_registro_pago}) => [id_registro_pago])
        await dbFunctionsFactura.eliminarPago(id_pagos_eliminar)
        if(resp == "3"){
            res.send("3");
       }
    }
    res.send("1")
}

module.exports = facturacionCtrl;