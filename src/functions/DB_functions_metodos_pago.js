const dbFunctionsMetodosPago = {};
const pool = require('../database');
const servicios = require('./services');

dbFunctionsMetodosPago.metodosPago = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_tipo_pago WHERE estatus = 1`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE metodos de pago', err);
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

module.exports = dbFunctionsMetodosPago;