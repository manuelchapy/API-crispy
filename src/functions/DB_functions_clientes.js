const dbFunctionsClientes = {};
const pool = require('../database');
const servicios = require('./services');

dbFunctionsClientes.clientes = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_cliente`, function (err, result, fie) {
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

dbFunctionsClientes.verificarCliente = async(cedula) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_cliente WHERE cliente_cedula =  '${cedula}'`, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    connection.release();
                    resolve('3')
                }
                connection.release();
                if(result.length > 0){
                    resolve(result[0]);
                }else{
                    resolve("0");
                }
            })
        })
    });
}

dbFunctionsClientes.agregarCliente = async(cliente) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_cliente` SET?',
                cliente, (err, result) => {
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

dbFunctionsClientes.modificarCliente = async(cliente) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`UPDATE tbl_cliente SET cliente_nombre = '${cliente.cliente_nombre}', cliente_apellido = '${cliente.cliente_apellido}', cliente_cedula = '${cliente.cliente_cedula}', cliente_telefono = '${cliente.cliente_telefono}' WHERE id_cliente = ${cliente.id_cliente}`, async function (err, result, fields) {
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

dbFunctionsClientes.documentos = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_tipo_documento`, function (err, result, fie) {
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

module.exports = dbFunctionsClientes;