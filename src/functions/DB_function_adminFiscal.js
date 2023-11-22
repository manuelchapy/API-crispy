const dbFunctionsAdminFiscal = {};
const pool = require('../database');
const servicios = require('./services');
const plantillas_ordenes = require('../models/modelos_para_cierre_de_caja/plantillas_ordenes_trabajo')

dbFunctionsAdminFiscal.extraerFacturaEntreFechas = async(desde, hasta) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            //sql = `SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.numero_orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido FROM tbl_factura LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '${desde}' AND '${hasta}') OR (fecha_creacion_factura BETWEEN '${desde}' AND '${hasta}') ORDER BY tbl_factura.id_factura ASC`
            //console.log(desde, hasta)
            connection.query(`SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.estatus, tbl_factura.referencia, tbl_factura.numero_orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, ${servicios.date_format_left}tbl_factura.fecha_creacion_factura${servicios.date_format_right} fecha_creacion_factura, ${servicios.date_format_left}tbl_factura.fecha_cancelacion${servicios.date_format_right} fecha_cencelacion_factura, ${servicios.date_format_left}tbl_factura.fecha_creacion_orden_trabajo${servicios.date_format_right} fecha_creacion_orden_trabajo, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido FROM tbl_factura LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN "${desde}" AND "${hasta}") OR (fecha_creacion_factura BETWEEN "${desde}" AND "${hasta}") ORDER BY tbl_factura.id_factura ASC`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve("-1")
                }
                if(result){
                    connection.release();
                    //console.log("ppppppp", result)
                    resolve(result)
                }
            })
        })
    })
}

dbFunctionsAdminFiscal.agruparPagosPorFactura = async(facturas, pagos) => {
    return new Promise(async (resolve, reject) => {
        facturas.map(factura => {
            pagos.forEach(pago => {
                //console.log(factura, pago)
                if(pago.id_factura == factura.id_factura){
                    factura.pagos.push(pago)
                }
            });
        })
        resolve(facturas);
    })
    
}

dbFunctionsAdminFiscal.extraerItemsGrupoFacturas = async(idFacturas) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT tbl_detalle_factura_item.id_detalle_factura_item, tbl_detalle_factura_item.id_item, tbl_item.item_nombre, tbl_item.item_precio, tbl_categoria.categoria_nombre FROM tbl_detalle_factura_item LEFT JOIN tbl_item ON tbl_item.id_item = tbl_detalle_factura_item.id_item LEFT JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_item.id_categoria WHERE tbl_detalle_factura_item.id_factura in (${idFacturas})`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve("-1")
                }
                if(result){
                    connection.release();
                    //console.log("ppppppp", result)
                    resolve(result)
                }
            })
        })
    })
}

dbFunctionsAdminFiscal.resetearJSONOrdenesTrabajo = async() => {
    return new Promise(async (resolve, reject) => {
            plantillas_ordenes.metodos_pago_efectivo_ordenes_trabajo.dolares =          0,
            plantillas_ordenes.metodos_pago_efectivo_ordenes_trabajo.pesos =            0,
            plantillas_ordenes.metodos_pago_efectivo_ordenes_trabajo.bolivares =        0,
            plantillas_ordenes.metodos_pago_transferencia_ordenes_trabajo.dolares =     0,
            plantillas_ordenes.metodos_pago_transferencia_ordenes_trabajo.pesos =       0,
            plantillas_ordenes.metodos_pago_transferencia_ordenes_trabajo.bolivares =   0,
            plantillas_ordenes.metodos_pago_pago_movil_ordenes_trabajo.dolares =        0,
            plantillas_ordenes.metodos_pago_pago_movil_ordenes_trabajo.pesos =          0,
            plantillas_ordenes.metodos_pago_pago_movil_ordenes_trabajo.bolivares =      0,
            plantillas_ordenes.metodos_pago_zelle_ordenes_trabajo.dolares =             0,
            plantillas_ordenes.metodos_pago_zelle_ordenes_trabajo.pesos =               0,
            plantillas_ordenes.metodos_pago_zelle_ordenes_trabajo.bolivares =           0,
            plantillas_ordenes.metodos_pago_bancolombia_ordenes_trabajo.dolares =       0,
            plantillas_ordenes.metodos_pago_bancolombia_ordenes_trabajo.pesos =         0,
            plantillas_ordenes.metodos_pago_bancolombia_ordenes_trabajo.bolivares =     0,
            plantillas_ordenes.metodos_pago_binance_ordenes_trabajo.dolares =           0,
            plantillas_ordenes.metodos_pago_binance_ordenes_trabajo.pesos =             0,
            plantillas_ordenes.metodos_pago_binance_ordenes_trabajo.bolivares =         0,
            plantillas_ordenes.totales_pagos_ordenes_trabajo.dolares =                  0,
            plantillas_ordenes.totales_pagos_ordenes_trabajo.pesos =                    0,
            plantillas_ordenes.totales_pagos_ordenes_trabajo.bolivares =                0,
            plantillas_ordenes.metodos_pago_tarjeta_credito_ordenes_trabajo.bolivares = 0,
            plantillas_ordenes.metodos_pago_tarjeta_debito_ordenes_trabajo.bolivares =  0,
            plantillas_ordenes.cantidad_ordenes_trabajo.cantidad =                      0,
            plantillas_ordenes.cantidad_ordenes_trabajo.primera_orden_trabajo =         0,
            plantillas_ordenes.cantidad_ordenes_trabajo.ultima_orden_trabajo =          0;
            plantillas_ordenes.cantidad_ordenes_trabajo_credito.cantidad =              0;
            plantillas_ordenes.cantidad_ordenes_trabajo_credito.primera_orden_trabajo = 0;
            plantillas_ordenes.cantidad_ordenes_trabajo_credito.ultima_orden_trabajo  = 0;
            plantillas_ordenes.totales_debe_ordenes_trabajo_credito.bolivares         = 0;
            plantillas_ordenes.totales_debe_ordenes_trabajo_credito.dolares           = 0;
            plantillas_ordenes.totales_debe_ordenes_trabajo_credito.pesos             = 0;
            plantillas_ordenes.cantidad_ordenes_trabajo_anuladas.cantidad = 0;
            plantillas_ordenes.lista_ordenes_trabajo_credito = [];
            plantillas_ordenes.totales_debe_ordenes_trabajo_credito.lista_ordenes_trabajo_credito = [];
            plantillas_ordenes.balance_ordenes_trabajo.lista_ordenes_trabajo_credito = [];
            plantillas_ordenes.balance_ordenes_trabajo.pagos_bancolombia = [];
            plantillas_ordenes.balance_ordenes_trabajo.pagos_binance = [];
            plantillas_ordenes.balance_ordenes_trabajo.pagos_pago_movil = [];
            plantillas_ordenes.balance_ordenes_trabajo.pagos_zelle = [];
            plantillas_ordenes.ordenes_anuladas = [];
            resolve("1")
    })
    
}

dbFunctionsAdminFiscal.resetearOrdenes = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('UPDATE `tbl_numero_orden_tmp` SET numero_orden_tmp = 1 WHERE id_numero_orden_tmp = 1', 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve("-1");
                }else{
                    connection.release();
                    resolve("1");
                }
            })
        });
    })
}



module.exports = dbFunctionsAdminFiscal;

