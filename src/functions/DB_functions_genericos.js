const dbFunctionsGenericos = {};
const pool = require('../database');
const servicios = require('../functions/services')

dbFunctionsGenericos.registrosItemsPorFactura = async(idFacturas) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT tbl_detalle_factura_item.id_detalle_factura_item, tbl_detalle_factura_item.id_factura, tbl_detalle_factura_item.id_item, tbl_item.item_nombre, tbl_item.item_precio FROM tbl_detalle_factura_item LEFT JOIN tbl_item ON tbl_item.id_item = tbl_detalle_factura_item.id_item WHERE id_factura in (${idFacturas})`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE REGISTROS DE PAGO', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    resolve(result);
                }
            });
        })
    });
}

dbFunctionsGenericos.buscarOrdenesPorFacturas = async(idFacturas) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT tbl_factura.id_factura, tbl_orden.orden_numero FROM tbl_factura LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_item = tbl_detalle_factura_item.id_detalle_factura_item LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden WHERE tbl_factura.id_factura in (${idFacturas}) GROUP BY tbl_orden.id_orden`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE DETALLE FACTURA ITEM', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    resolve(result);
                }
            });
        })
    });
}

dbFunctionsGenericos.eliminarDetalleOrden = async(idDetalleFacturaItem) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`DELETE FROM tbl_detalle_orden WHERE id_detalle_factura_item = ${idDetalleFacturaItem}`, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve('-1');
                }else{
                    connection.release();
                    resolve('1');
                }
            })
        });
    })
} 

dbFunctionsGenericos.eliminarDetalleFacturaPaciente = async(idDetalleFacturaItem) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`DELETE FROM tbl_detalle_factura_item WHERE id_detalle_factura_item = ${idDetalleFacturaItem}`, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve('-1');
                }else{
                    connection.release();
                    resolve('1');
                }
            })
        });
    })
} 

dbFunctionsGenericos.ultimaOrdenDeMesa = async(idMesas) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            //console.log(`SELECT tbl_orden.fecha_emision, tbl_factura.referencia, tbl_mesa.id_mesa FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_detalle_factura_item = tbl_detalle_orden.id_detalle_factura_item LEFT JOIN tbl_factura ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_mesa ON tbl_mesa.id_mesa = tbl_factura.id_mesa WHERE (tbl_factura.id_mesa in (${idMesas}) AND tbl_orden.fecha_emision = (SELECT MAX(tbl_orden.fecha_emision) FROM tbl_orden) AND tbl_factura.impreso = 0) GROUP BY tbl_mesa.id_mesa`)
            //`SELECT tbl_mesa.id_mesa, MAX(date_format(tbl_orden.fecha_emision, '%T')) AS fecha_ultima_orden, tbl_orden.orden_numero, tbl_factura.numero_referencia FROM tbl_mesa LEFT JOIN tbl_factura ON tbl_factura.id_mesa = tbl_mesa.id_mesa LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_item = tbl_detalle_factura_item.id_detalle_factura_item LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_factura.impreso = 0 GROUP BY tbl_mesa.id_mesa`
            let sql = `SELECT tbl_mesa.id_mesa, MAX(tbl_orden.id_orden) as id_orden, MAX(date_format(tbl_orden.fecha_emision, '%T')) AS fecha_ultima_orden, MAX(tbl_orden.orden_numero) as orden_numero, tbl_factura.numero_referencia FROM tbl_mesa LEFT JOIN tbl_factura ON tbl_factura.id_mesa = tbl_mesa.id_mesa LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_item = tbl_detalle_factura_item.id_detalle_factura_item LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_factura.impreso = 0 GROUP BY tbl_mesa.id_mesa`
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE REGISTROS DE PAGO', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    resolve(result);
                }
            });
        })
    });
};

dbFunctionsGenericos.primeraOrdenDeMesa = async(idMesas) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            //console.log(`SELECT tbl_orden.fecha_emision, tbl_factura.referencia, tbl_mesa.id_mesa FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_detalle_factura_item = tbl_detalle_orden.id_detalle_factura_item LEFT JOIN tbl_factura ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_mesa ON tbl_mesa.id_mesa = tbl_factura.id_mesa WHERE (tbl_factura.id_mesa in (${idMesas}) AND tbl_orden.fecha_emision = (SELECT MAX(tbl_orden.fecha_emision) FROM tbl_orden) AND tbl_factura.impreso = 0) GROUP BY tbl_mesa.id_mesa`)
            //`SELECT tbl_mesa.id_mesa, MAX(date_format(tbl_orden.fecha_emision, '%T')) AS fecha_ultima_orden, tbl_orden.orden_numero, tbl_factura.numero_referencia FROM tbl_mesa LEFT JOIN tbl_factura ON tbl_factura.id_mesa = tbl_mesa.id_mesa LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_item = tbl_detalle_factura_item.id_detalle_factura_item LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_factura.impreso = 0 GROUP BY tbl_mesa.id_mesa`
            let sql = `SELECT tbl_mesa.id_mesa, MIN(tbl_orden.id_orden) as id_orden, MIN(date_format(tbl_orden.fecha_emision, '%T')) AS fecha_primera_orden, MIN(tbl_orden.orden_numero) as orden_numero, tbl_factura.numero_referencia FROM tbl_mesa LEFT JOIN tbl_factura ON tbl_factura.id_mesa = tbl_mesa.id_mesa LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_item = tbl_detalle_factura_item.id_detalle_factura_item LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_factura.impreso = 0 GROUP BY tbl_mesa.id_mesa`
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE REGISTROS DE PAGO', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    resolve(result);
                }
            });
        })
    });
};

dbFunctionsGenericos.extrearRegistrosPagoRangoFacturas = async(idFacturas, desde, hasta) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, ${servicios.date_format_left}tbl_registro_pago.fecha_monto${servicios.date_format_right} fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_transferencia, tbl_registro_pago.monto, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_factura in (${idFacturas}) AND (tbl_registro_pago.fecha_monto BETWEEN '${desde}' AND '${hasta}')`
        //console.log(sql);
        pool.getConnection(function(err, connection){
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR EN BUSQUEDA DE PAGOS', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    registroPago = result
                    resolve(registroPago);
                }
            });
        });
    }) 
}

dbFunctionsGenericos.extrearPagos = async(idFactura) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, ${servicios.date_format_left}tbl_registro_pago.fecha_monto${servicios.date_format_right} fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_transferencia, tbl_registro_pago.monto, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre, tbl_tipo_pago.tipo_pago_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_factura = ${idFactura}`
        //console.log(sql);
        pool.getConnection(function(err, connection){
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR EN BUSQUEDA DE PAGOS', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    registroPago = result
                    resolve(registroPago);
                }
            });
        });
    }) 
}

dbFunctionsGenericos.extraerOrdenes = async(idFactura) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_mesa.id_mesa, tbl_orden.id_orden, date_format(tbl_orden.fecha_emision, '%T'), tbl_orden.orden_numero, tbl_factura.numero_referencia FROM tbl_mesa LEFT JOIN tbl_factura ON tbl_factura.id_mesa = tbl_mesa.id_mesa LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_factura = tbl_factura.id_factura LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_item = tbl_detalle_factura_item.id_detalle_factura_item LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_factura.impreso = 0 GROUP BY tbl_mesa.id_mesa`
        //console.log(sql);
        pool.getConnection(function(err, connection){
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR EN BUSQUEDA DE PAGOS', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    registroPago = result
                    resolve(registroPago);
                }
            });
        });
    }) 
}

dbFunctionsGenericos.getTime = async() =>{
    return new Promise((resolve, reject) => {
        resolve(new Date(new Date().toLocaleString("en-US", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })));
    })
}

dbFunctionsGenericos.dateFormat = async() =>{
    return new Promise((resolve, reject) => {
        let time = new Date(new Date().toLocaleString("en-US", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }));
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();
        let formatTime = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
        resolve(formatTime);
    })
}

dbFunctionsGenericos.ordenarCategoriasItems = async(items) =>{
    return new Promise((resolve, reject) => {
        const categoryOrder = {
            "Hamburguesas": 1,
            "Bebidas": 2,
            "Postres": 3,
            "Adicionales": 4,
        };
        items.sort((a, b) => {
            const orderA = categoryOrder[a.categoria_nombre];
            const orderB = categoryOrder[b.categoria_nombre];
            
            if (orderA < orderB) {
                return -1;
            }
            if (orderA > orderB) {
                return 1;
            }
            return 0;
        });
        resolve(items)
    });
}

dbFunctionsGenericos.ordenarCategoriasItemsCierreDeCaja = async(items) =>{
    return new Promise((resolve, reject) => {
        const categoryOrder = {
            "Hamburguesas": 1,
            "Adicionales": 2,
            "Bebidas": 3,
            "Postres": 4,
        };
        items.sort((a, b) => {
            const orderA = categoryOrder[a.categoria_nombre];
            const orderB = categoryOrder[b.categoria_nombre];
            
            if (orderA < orderB) {
                return -1;
            }
            if (orderA > orderB) {
                return 1;
            }
            return 0;
        });
        resolve(items)
    });
}

module.exports = dbFunctionsGenericos;
