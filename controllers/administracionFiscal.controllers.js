const administracionFiscalCtrl = {};
const dbFunctionsAdminFiscal = require("../src/functions/DB_function_adminFiscal");
const dbFunctionsGenericos = require("../src/functions/DB_functions_genericos");
const dbFunctionsItem = require("../src/functions/DB_functions_items")
const plantillas_ordenes = require("../src/models/modelos_para_cierre_de_caja/plantillas_ordenes_trabajo");

administracionFiscalCtrl.cierreConsolidado = async(req, res) =>{
    
    let facturas = await dbFunctionsAdminFiscal.extraerFacturaEntreFechas(req.body.from, req.body.to)
    if(facturas.length > 0){
        await dbFunctionsAdminFiscal.resetearJSONOrdenesTrabajo()
        facturas.map(factura => factura.pagos = [])
        //console.log(facturas.length)
        plantillas_ordenes.cantidad_ordenes_trabajo.primera_orden_trabajo = facturas[0].numero_orden_trabajo;
        plantillas_ordenes.cantidad_ordenes_trabajo.ultima_orden_trabajo = facturas[facturas.length-1].numero_orden_trabajo;
        let facturasActivas = facturas.filter((factura) => factura.estatus == 1);
        let facturasAnuladas = facturas.filter((factura) => factura.estatus == 0);
        let idFacturas = facturasActivas.map(({id_factura}) => id_factura);
        let pagos = await dbFunctionsGenericos.extrearRegistrosPagoRangoFacturas(idFacturas, req.body.from, req.body.to)
        let arrayItems = await dbFunctionsAdminFiscal.extraerItemsGrupoFacturas(idFacturas)
        //console.log("0000000000000", arrayItems)
        let itemsDeFacturaRepetidos = [];
        arrayItems.forEach(item => {
            itemsDeFacturaRepetidos.push({id_item: item.id_item, item_nombre: item.item_nombre, item_categoria: item.categoria_nombre})
        })
        let itemsDeFacturaSinRepetir = new Set();
        itemsDeFacturaRepetidos.forEach(item => {
            itemsDeFacturaSinRepetir.add(JSON.stringify(item))
        })
        itemsDeFacturaSinRepetir = Array.from(itemsDeFacturaSinRepetir).map(item => JSON.parse(item));
        itemsDeFacturaSinRepetir = itemsDeFacturaSinRepetir.map(item => ({ ...item, cantidad: 0 }));
        itemsDeFacturaSinRepetir.forEach(item => {
            arrayItems.forEach(itemDeFactura => {
                //console.log("!!!!!", item.cantidad)
                if(item.id_item == itemDeFactura.id_item){
                    item.cantidad++
                }
            })
        })
        console.log("!!!!!!!!!!!!!!1", itemsDeFacturaSinRepetir)
        let itemsDeFacturaSinRepetirOrdenados = await dbFunctionsGenericos.ordenarCategoriasItemsCierreDeCaja(itemsDeFacturaSinRepetir)
        console.log("XXXXXXXXXXXXXX", itemsDeFacturaSinRepetirOrdenados)
        plantillas_ordenes.balance_ordenes_trabajo.cantidad_items = itemsDeFacturaSinRepetirOrdenados;
        facturas = await dbFunctionsAdminFiscal.agruparPagosPorFactura(facturas, pagos);
        let cantidadCredito = 0;
        let cantidadContado = 0;
        let anuladas = 0;
        facturasActivas.forEach(factura => {
                ////////////////////SUMATORIA DE TOTALES DE DEDUA ORDENES TRABAJO A CREDITO/////////////////////
                if(factura.id_tipo_factura == 4 && factura.estatus == 1){
                    cantidadCredito++
                    plantillas_ordenes.balance_ordenes_trabajo.totales_debe_ordenes_trabajo_credito.dolares = plantillas_ordenes.balance_ordenes_trabajo.totales_debe_ordenes_trabajo_credito.dolares + factura.total_dolares;
                    //console.log("0000000000000000000", plantillas_ordenes.lista_ordenes_trabajo_credito.length)
                    plantillas_ordenes.balance_ordenes_trabajo.lista_ordenes_trabajo_credito.push(factura)
                }else if(factura.id_tipo_factura == 3 && factura.estatus == 1){
                    cantidadContado++
                }
                ////////////////////////////////////////////////////////////////////////////////////////////////
                factura.pagos.forEach(pago =>{
                    ////////PAGO POR EFECTIVO////////////
                    if(pago.id_tipo_pago == 1){
                        if(pago.tipo_registro == 0){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.dolares + pago.monto;
                            }else if(pago.divisa_nombre == 'PESOS'){
                                //console.log(pago.monto, "DESDE INGRESOS")
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.pesos + pago.monto;
                            }else if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.bolivares + pago.monto;
                            }
                            /////VUELTOS//////
                        }else if(pago.tipo_registro == 1){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.dolares - pago.monto;
                            }else if(pago.divisa_nombre == 'PESOS'){
                                //console.log(pago.monto, "DESDE VUELTOS")
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.pesos - pago.monto;
                            }else if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.bolivares - pago.monto;
                            }
                        }
                    ////////////////PAGO POR TRANSFERENCIAS/////////////////
                    }else if(pago.id_tipo_pago == 2){
                        if(pago.tipo_registro == 0){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.dolares + pago.monto;
                            }else if(pago.divisa_nombre == 'PESOS'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.pesos + pago.monto;
                            }else if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.bolivares + pago.monto;
                            }
                            /////VUELTOS//////
                        }else if(pago.tipo_registro == 1){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.dolares - pago.monto;
                            }else if(pago.divisa_nombre == 'PESOS'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.pesos - pago.monto;
                            }else if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_transferencia_ordenes_trabajo.bolivares - pago.monto;
                            }
                        }
                        ////////////////PAGO POR PAGO MOVIL/////////////////
                    }else if(pago.id_tipo_pago == 3){
                        ////ADD PAGO//////
                        plantillas_ordenes.balance_ordenes_trabajo.pagos_pago_movil.push({...pago, numero_factura: factura.numero_factura, numero_orden_trabajo: factura.numero_orden_trabajo})
                        //////////////////
                        if(pago.tipo_registro == 0){
                            if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_pago_movil_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_pago_movil_ordenes_trabajo.bolivares + pago.monto;
                            }
                            /////VUELTOS//////
                        }else if(pago.tipo_registro == 1){
                            if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_pago_movil_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_pago_movil_ordenes_trabajo.bolivares - pago.monto;
                            }
                        }
                        ////////////////PAGO POR ZELLE/////////////////////////
                    }else if(pago.id_tipo_pago == 4){
                        ////ADD PAGO//////
                        plantillas_ordenes.balance_ordenes_trabajo.pagos_zelle.push({...pago, numero_factura: factura.numero_factura, numero_orden_trabajo: factura.numero_orden_trabajo})
                        //////////////////
                        if(pago.tipo_registro == 0){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_zelle_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_zelle_ordenes_trabajo.dolares + pago.monto;
                            }
                            /////VUELTOS//////
                        }else if(pago.tipo_registro == 1){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_zelle_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_zelle_ordenes_trabajo.dolares - pago.monto;
                            }
                        }
                        //////////////PAGO POR BANCOLOMBIA////////////////////////
                    }else if(pago.id_tipo_pago == 5){
                        ////ADD PAGO//////
                        plantillas_ordenes.balance_ordenes_trabajo.pagos_bancolombia.push({...pago, numero_factura: factura.numero_factura, numero_orden_trabajo: factura.numero_orden_trabajo})
                        //////////////////
                        if(pago.tipo_registro == 0){
                            if(pago.divisa_nombre == 'PESOS'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_bancolombia_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_bancolombia_ordenes_trabajo.pesos + pago.monto;
                            }
                            /////VUELTOS//////
                        }else if(pago.tipo_registro == 1){
                            if(pago.divisa_nombre == 'PESOS'){
                                    plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_bancolombia_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_bancolombia_ordenes_trabajo.pesos - pago.monto;
                                }
                            }
                            ////////////////PAGO POR BINANCE/////////////////
                    }else if(pago.id_tipo_pago == 6){
                        ////ADD PAGO//////
                        plantillas_ordenes.balance_ordenes_trabajo.pagos_binance.push({...pago, numero_factura: factura.numero_factura, numero_orden_trabajo: factura.numero_orden_trabajo})
                        //////////////////
                        if(pago.tipo_registro == 0){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_binance_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_binance_ordenes_trabajo.dolares + pago.monto;
                            }
                            /////VUELTOS//////
                        }else if(pago.tipo_registro == 1){
                            if(pago.divisa_nombre == 'DOLARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_binance_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_binance_ordenes_trabajo.dolares - pago.monto;
                            }
                        }
                        //console.log("!!!!!!!!!!!!!!!!!!!!1 entro a binance", )
                    }else if(pago.id_tipo_pago == 7){
                    ////////////////////////PAGO POR TARJETA DEBITO///////////////////
                
                        if(pago.tipo_registro == 0){
                            if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_debito_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_debito_ordenes_trabajo.bolivares + pago.monto;
                            }
                            /////VUELTOS//////
                        }else if(pago.tipo_registro == 1){
                            if(pago.divisa_nombre == 'BOLIVARES'){
                                plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_debito_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_debito_ordenes_trabajo.bolivares - pago.monto;
                            }
                        }
                    }else if(pago.id_tipo_pago == 8){
                        ////////////////////////PAGO POR TARJETA CREDITO///////////////////
                    
                            if(pago.tipo_registro == 0){
                                if(pago.divisa_nombre == 'BOLIVARES'){
                                    plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_credito_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_credito_ordenes_trabajo.bolivares + pago.monto;
                                }
                                /////VUELTOS//////
                            }else if(pago.tipo_registro == 1){
                                if(pago.divisa_nombre == 'BOLIVARES'){
                                    plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_credito_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_tarjeta_credito_ordenes_trabajo.bolivares - pago.monto;
                                }
                            }
                        }
                    ////////////////////////SUMATORIA GENERAL/////////////////////////
                    if(pago.tipo_registro == 0){
                        if(pago.divisa_nombre == 'DOLARES'){
                            //console.log("SIN SON DOLARES", pago)
                            plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.dolares + pago.monto;
                        }else if(pago.divisa_nombre == 'PESOS'){
                            plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.pesos + pago.monto;
                        }else if(pago.divisa_nombre == 'BOLIVARES'){
                            //console.log("SIN SON BS", pago.monto)
                            plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.bolivares + pago.monto;
                        }
                        /////VUELTOS//////
                    }else if(pago.tipo_registro == 1){
                        if(pago.divisa_nombre == 'DOLARES'){
                            //console.log("SIN SON DOLARES VUELTOS", pago)
                            plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.dolares = plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.dolares - pago.monto;
                        }else if(pago.divisa_nombre == 'PESOS'){
                            plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.pesos = plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.pesos - pago.monto;
                        }else if(pago.divisa_nombre == 'BOLIVARES'){
                            //console.log("SIN SON VUELTOS", pago.monto)
                            plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.bolivares = plantillas_ordenes.balance_ordenes_trabajo.totales_pagos_ordenes_trabajo.bolivares - pago.monto;
                        }
                    }
                    //console.log(plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.efectivo_dolares)
                })
        })
        //console.log("88888888888888888888888", facturasAnuladas)
        let aux_facturas_anuladas = [];
        aux_facturas_anuladas.push(facturasAnuladas);
        plantillas_ordenes.balance_ordenes_trabajo.ordenes_anuladas = aux_facturas_anuladas[0];
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1", plantillas_ordenes.balance_ordenes_trabajo.ordenes_anuladas)
        //console.log("***********************", plantillas_ordenes.ordenes_anuladas)
        plantillas_ordenes.balance_ordenes_trabajo.cantidad_ordenes_trabajo_anuladas.cantidad = facturasAnuladas.length;
        if(cantidadCredito > 0){
            console.log(cantidadCredito)
            plantillas_ordenes.balance_ordenes_trabajo.cantidad_ordenes_trabajo_credito.primera_orden_trabajo = plantillas_ordenes.balance_ordenes_trabajo.lista_ordenes_trabajo_credito[0];
            plantillas_ordenes.balance_ordenes_trabajo.cantidad_ordenes_trabajo_credito.ultima_orden_trabajo = plantillas_ordenes.balance_ordenes_trabajo.lista_ordenes_trabajo_credito[cantidadCredito - 1];
            plantillas_ordenes.balance_ordenes_trabajo.cantidad_ordenes_trabajo_credito.cantidad = cantidadCredito;
        }
        if(cantidadContado > 0){
            plantillas_ordenes.cantidad_ordenes_trabajo.cantidad = cantidadContado;
        }else{
            plantillas_ordenes.cantidad_ordenes_trabajo.cantidad = 0;
        }   
        //console.log(plantillas_ordenes.balance_ordenes_trabajo.metodos_pago_efectivo_ordenes_trabajo.efectivo_dolares)
        res.send(plantillas_ordenes.balance_ordenes_trabajo);
    }else{
        res.send("3")
    }
};

administracionFiscalCtrl.resetearOrdenes = async(req, res) =>{
    let resp = await dbFunctionsAdminFiscal.resetearOrdenes();
    res.send(resp);
}



module.exports = administracionFiscalCtrl;