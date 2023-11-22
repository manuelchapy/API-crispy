const dbFunctionsMesa = {};
const pool = require('../database');

dbFunctionsMesa.mesas = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_mesa`, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    connection.release();
                    resolve('3')
                }
                connection.release();
                resolve(result)
            })
        })
    });
}

dbFunctionsMesa.facturasPorMesa = async(idMesas) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_factura WHERE impreso = 0 AND id_mesa in (${idMesas})`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE FACTURAS', err);
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

dbFunctionsMesa.FacturasDeUnaMesa = async(idMesa) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_factura WHERE impreso = 0 AND id_mesa = (${idMesa})`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE FACTURAS DE LA MESA', err);
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

dbFunctionsMesa.mesa = async(id_mesa) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_mesa WHERE id_mesa = ${id_mesa}`, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    connection.release();
                    resolve('3')
                }
                connection.release();
                resolve(result)
            })
        })
    });
}

module.exports = dbFunctionsMesa;