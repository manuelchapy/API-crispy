const dbFunctionsTareas = {};
const pool = require('../database');
const servicios = require('./services');

dbFunctionsTareas.tareas = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_tarea`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECTTAREAS', err);
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

dbFunctionsTareas.crearTarea = async(tarea) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_tarea` SET?', tarea, (err, result) => {
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

dbFunctionsTareas.editarTarea = async(tarea) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`UPDATE tbl_tarea SET tarea_nombre = '${tarea.tarea_nombre}' WHERE id_tarea = ${tarea.id_tarea}`, (err, result) => {
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

dbFunctionsTareas.tareasRol = async(tareas, idRol) => {
    return new Promise((resolve, reject) => {
        let idsTareasRoles = tareas.map(({id_tarea}) => [idRol, id_tarea])
        console.log(idsTareasRoles);
        pool.getConnection(function(err, connection){
            const sql = `INSERT INTO tbl_rol_tarea (id_rol, id_tarea) VALUES?`;
                connection.query(sql, [idsTareasRoles], (err, result) => {
                    if (err) {
                        connection.release();
                        console.log(err);
                        resolve("3")
                    } else {
                        connection.release();
                        resolve("1")
                    }
                })
        })
    });
}

dbFunctionsTareas.checkPasoControlador = async(idRol, idTarea) => {
    console.log("entro en checkPasoControlador")
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_rol_tarea WHERE id_rol = ${idRol} AND id_tarea = ${idTarea}`, function (err, result, fields) {
                console.log("!!!!!!!!!!!!!!", result)
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECTTAREAS en funcion buscarTareasPorRol', err);
                    resolve('3')
                }
                if(result.length > 0){
                    console.log("result mayor a 0 envia un 1")
                    connection.release();
                    resolve("1");
                }else{
                    connection.release();
                    console.log("envia un 0")
                    resolve("0")
                }
            });
        })
    });
}

module.exports = dbFunctionsTareas;