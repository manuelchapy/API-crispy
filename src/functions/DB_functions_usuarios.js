const dbFunctionsUsuario = {};
const pool = require('../database');

dbFunctionsUsuario.crearUsuario = async(usuario) =>{
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_usuario` SET?',
                usuario, (err, result) => {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve("3")
                } else {
                    connection.release();
                    resolve("1")
                }
            });
        });
    });
}

dbFunctionsUsuario.usuarios = async(usuario) =>{
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_usuario`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT USUARIOS', err);
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

dbFunctionsUsuario.buscarUsuario = async(idUsuario) =>{
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_usuario WHERE id_usuario = ${idUsuario}`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT USUARIOS', err);
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

dbFunctionsUsuario.modificarUsuario = async(usuario) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`UPDATE tbl_usuario SET usuario_nombre = '${usuario.usuario_nombre}', usuario_apellido = '${usuario.usuario_apellido}', usuario_cedula = '${usuario.usuario_cedula}', usuario_telefono = '${usuario.usuario_telefono}', usuario_password = '${usuario.usuario_password}', usuario_username = '${usuario.usuario_username}', id_rol = ${usuario.id_rol} WHERE id_usuario = ${usuario.id_usuario}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR!', err);
                    resolve("-3")
                }
                if(result){
                    connection.release();
                    resolve("1")
                }
            })
        })
    })
}

dbFunctionsUsuario.checkUsuario = async(username, numero) => {
    let sql;
    if(numero == 1){
        sql = `SELECT usuario_username FROM tbl_usuario WHERE usuario_username = '${username}'`
    }else if(numero == 2){
        sql = `SELECT * FROM tbl_usuario WHERE usuario_username = '${username}'`
    }
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT USUARIOS', err);
                    resolve('3')
                }
                if(result){
                    connection.release();
                    if(result.length > 0){
                        resolve(result[0])
                    }else{
                        resolve("0")
                    }   
                }
            });
        })
    });
}

module.exports = dbFunctionsUsuario;