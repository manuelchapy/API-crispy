const dbFunctionsRoles = {};
const pool = require('../database');
const servicios = require('./services');

dbFunctionsRoles.roles = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_rol`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT ROLES', err);
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

dbFunctionsRoles.crearRol = async(rol) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_rol` SET?', rol, (err, result) => {
                if (err) {
                    connection.release();
                    console.log('ERROR en AGREGAR ROL', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    resolve("1");
                }
            });
        })
    });
}

dbFunctionsRoles.editarRol = async(rol) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`UPDATE tbl_rol SET rol_nombre = '${rol.rol_nombre}' WHERE id_rol = ${rol.id_rol}`, (err, result) => {
                if (err) {
                    connection.release();
                    console.log('ERROR en MODIFICAR ROL', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    resolve("1");
                }
            });
        })
    });
}

module.exports = dbFunctionsRoles;