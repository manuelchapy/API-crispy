const dbFunctionsDivisas = {};
const pool = require('../database');
const servicios = require('./services');
const listaDeServicios = require("./services");

dbFunctionsDivisas.registroDivisas = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a INNER JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM tbl_registro_divisa b WHERE a.id_divisa = b.id_divisa)`, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    connection.release();
                    res.send('3')
                }
                connection.release();
                resolve(result)
            })
        })
    });
}

dbFunctionsDivisas.divisas = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_divisa`, function (err, result, fie) {
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

dbFunctionsDivisas.historialDivisas = async(idDivisa) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT tbl_registro_divisa.id_registro_divisa, tbl_registro_divisa.id_divisa, tbl_registro_divisa.tasa_actual, ${servicios.date_format_left}tbl_registro_divisa.fecha_registro${servicios.date_format_right} fecha, tbl_divisa.divisa_nombre FROM tbl_registro_divisa INNER JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_divisa.id_divisa= ${idDivisa}`, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    connection.release();
                    res.send('3')
                }
                connection.release();
                resolve(result)
            })
        })
    })
}

dbFunctionsDivisas.agregarDivisa = async(divisa) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_divisa` SET?', divisa, 
            (err, result) => {
                if (err) {
                    console.log(err)
                    connection.release();
                    resolve('3')
                } else {
                    connection.release();
                    //res.send('AGREGO FACTURA!')
                    resolve("1")
                }
            });
        });
    })
}

dbFunctionsDivisas.agregarTasaDivisa= async(nuevaTasa) =>{
    return new Promise((resolve, reject) => {
        let nueva = {
            ...nuevaTasa,
            fecha_registro: servicios.time
        }
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_registro_divisa` SET?', 
            nueva, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    connection.release();
                    resolve('3')
                } else {
                    //console.log('agrego!!', result)
                    connection.release();
                    resolve('1')
                }
            });
        });
    });
}

module.exports = dbFunctionsDivisas;