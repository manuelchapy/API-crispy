const dbFunctionsCategorias = {};
const pool = require('../database');
const servicios = require('./services');

dbFunctionsCategorias.categorias = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_categoria`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE CATEGORIAS', err);
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

module.exports = dbFunctionsCategorias;