const dbFunctionsItem = {};
const pool = require('../database');

dbFunctionsItem.items = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT tbl_item.id_item, tbl_item.item_nombre, tbl_item.id_categoria, tbl_item.item_precio, tbl_item.estatus, tbl_categoria.categoria_nombre FROM tbl_item LEFT JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_item.id_categoria WHERE estatus = 1`, function (err, result, fie) {
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

dbFunctionsItem.buscarItem = async(idItem) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT tbl_item.id_item, tbl_item.item_nombre, tbl_item.id_categoria, tbl_item.item_precio, tbl_item.estatus, tbl_categoria.categoria_nombre FROM tbl_item LEFT JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_item.id_categoria WHERE id_item = ${idItem}`, function (err, result, fie) {
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

dbFunctionsItem.itemsPorCategoria = async(idCategoria) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT tbl_item.id_item, tbl_item.item_nombre, tbl_item.id_categoria, tbl_item.item_precio, tbl_item.estatus, tbl_categoria.categoria_nombre FROM tbl_item LEFT JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_item.id_categoria WHERE id_categoria = ${idCategoria}`, function (err, result, fie) {
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

dbFunctionsItem.itemsAnulados = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_item WHERE estatus = 0`, function (err, result, fie) {
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

dbFunctionsItem.crearItem = async(nuevoItem) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_item` SET?', nuevoItem, 
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

dbFunctionsItem.anularItem = async(idItem) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`UPDATE tbl_item SET estatus = 0 WHERE id_item = ${idItem}`, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve('-1');
                }else{
                    connection.release();
                    resolve('1');
                }
            })
        });
    })
} 

dbFunctionsItem.activarItem = async(idItem) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`UPDATE tbl_item SET estatus = 1 WHERE id_item = ${idItem}`, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve('-1');
                }else{
                    connection.release();
                    resolve('1');
                }
            })
        });
    })
} 

dbFunctionsItem.modificarItem = async(item) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`UPDATE tbl_item SET item_nombre = '${item.item_nombre}', item_precio = ${item.item_precio}, id_categoria = ${item.id_categoria} WHERE id_item = ${item.id_item}`, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve('-1');
                }else{
                    connection.release();
                    resolve('1');
                }
            })
        });
    })
} 


module.exports = dbFunctionsItem;