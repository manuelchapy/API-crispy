const dbFunctionsPickups = {};
const pool = require('../database');
const servicios = require('./services');

dbFunctionsPickups.facturasActivasPickups = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
            connection.query(`SELECT id_factura, id_tipo_pedido, id_mesa, factura_qr, id_estado_factura, numero_factura, numero_orden_trabajo, id_cliente, referencia, numero_referencia, id_tipo_factura, id_usuario, id_usuario_anulacion, total_dolares, total_bolivares, total_pesos, descuento_bolivares, descuento_dolares, descuento_pesos, IGTF_bolivares, IGTF_dolares, IGTF_pesos, base_imponible_dolares, base_imponible_bolivares, tasa_bolivar_dia, tasa_pesos_dia, debe_dolares, DATE_FORMAT(fecha_creacion_factura, '%T') AS fecha_creacion_factura, DATE_FORMAT(fecha_creacion_orden_trabajo, '%T') AS fecha_creacion_orden_trabajo, DATE_FORMAT(fecha_cancelacion, '%T') AS fecha_cancelacion FROM tbl_factura WHERE (id_estado_factura = 2) AND impreso = 0 AND id_tipo_pedido = 3`, function (err, result, fields) {
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

module.exports = dbFunctionsPickups;