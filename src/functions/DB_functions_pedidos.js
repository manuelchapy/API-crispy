const dbFunctionsPedido = {};
const pool = require('../database');

dbFunctionsPedido.listaDeFacturasRecientes = async() =>{
    //LAS 5 ULTIMAS
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            let sql = `SELECT tbl_factura.id_factura, tbl_factura.id_tipo_pedido, tbl_factura.id_mesa, tbl_factura.numero_factura, tbl_factura.numero_orden_trabajo, tbl_factura.fecha_creacion_factura, tbl_factura.fecha_creacion_orden_trabajo, tbl_factura.fecha_cancelacion, tbl_mesa.numero_mesa, tbl_tipo_pedido.tipo_pedido FROM tbl_factura LEFT JOIN tbl_mesa ON tbl_mesa.id_mesa = tbl_factura.id_mesa LEFT JOIN tbl_tipo_pedido ON tbl_tipo_pedido.id_tipo_pedido = tbl_factura.id_tipo_pedido WHERE tbl_factura.impreso = 0 ORDER BY (tbl_factura.fecha_creacion_orden_trabajo) DESC LIMIT 5`
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT LAST FACTURAS', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    if(result.length > 0){
                        resolve(result)
                    }else{
                        resolve("0")
                    }   
                }
            });
        })
    });
}
dbFunctionsPedido.pedidoRecientePorFacturas = async(facturas) =>{
    return new Promise((resolve, reject) => {
        const stringQuerys = facturas.map((factura) =>{
            const stringQuery = `SELECT tbl_orden.id_orden, tbl_orden.orden_numero, tbl_orden.fecha_emision, tbl_orden.qr_orden, tbl_detalle_orden.id_detalle_orden, tbl_detalle_factura_item.id_detalle_factura_item, tbl_factura.id_tipo_pedido, tbl_factura.referencia, tbl_factura.id_mesa, tbl_factura.numero_factura, tbl_factura.numero_orden_trabajo, tbl_factura.fecha_creacion_factura, tbl_factura.fecha_creacion_orden_trabajo, tbl_factura.fecha_cancelacion, tbl_mesa.numero_mesa, tbl_tipo_pedido.tipo_pedido FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden LEFT JOIN tbl_detalle_factura_item ON tbl_detalle_factura_item.id_detalle_factura_item = tbl_detalle_orden.id_detalle_factura_item LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_item.id_factura LEFT JOIN tbl_mesa ON tbl_mesa.id_mesa = tbl_factura.id_mesa LEFT JOIN tbl_tipo_pedido ON tbl_tipo_pedido.id_tipo_pedido = tbl_factura.id_tipo_pedido WHERE tbl_factura.id_factura = ${factura.id_factura} ORDER BY (tbl_orden.fecha_emision) DESC LIMIT 1; `;  
            //console.log("**********", stringQuery)    
            return stringQuery
        })
        const fullUpdateQuery = stringQuerys.join('');
        //console.log("!!!!", stringQuerys)
        pool.getConnection(function(err, connection){
            console.log(fullUpdateQuery)
            connection.query(fullUpdateQuery, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT LAST PEDIDOS', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    if(result.length > 0){
                        resolve(result)
                        console.log("!!!!!!!!!!!!", result)
                    }else{
                        resolve("0")
                    }   
                }
            });
        })
    });
}

module.exports = dbFunctionsPedido;