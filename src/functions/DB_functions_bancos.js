const dbFunctionsBancos = {};
const pool = require('../database');
const servicios = require('./services');

dbFunctionsBancos.bancos = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_banco`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE BANCOS', err);
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

module.exports = dbFunctionsBancos;