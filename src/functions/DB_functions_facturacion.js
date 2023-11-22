const dbFunctionsFactura = {};
const modeloFactura = require('../models/models_DB/factura')
const dbFunctionsGenericos = require('../functions/DB_functions_genericos')
const listaDeServicios = require("./services");
const pool = require('../database');
const uniqid = require('uniqid');
const servicios = require('./services');


dbFunctionsFactura.guardarFactura = async(nuevaFactura) => {
    return new Promise(async (resolve, reject) => {
        let factura, numero;
      /*  if(nuevaFactura.id_tipo_factura == 1){
            /////////Para facturas a contado//////////////
            let aux = true, check;
            numero = await dbFunctionsFactura.extraerNumeroFacturaTmp()
            while(aux){
                check = await dbFunctionsFactura.checkNumeroNumeroFactura(numero);
                if(check == 0){
                    aux = false;
                    await dbFunctionsFactura.updateNumeroFacturaTmp();
                }else{
                    await dbFunctionsFactura.updateNumeroFacturaTmp();
                    numero = await dbFunctionsFactura.extraerNumeroFacturaTmp();
                }
            }
            factura = {
                        ...nuevaFactura, 
                        factura_qr: uniqid(), 
                        numero_factura: numero,
                        fecha_creacion_factura: listaDeServicios.time,
                        fecha_cancelacion:      listaDeServicios.time,  
                        id_estado_factura: 1,
                        impreso: 0,
                    }
        }if(nuevaFactura.id_tipo_factura == 2){
            //////////////Para facrturas a credito///////////////
            let aux = true, check;
            numero = await dbFunctionsFactura.extraerNumeroFacturaTmp()
            while(aux){
                check = await dbFunctionsFactura.checkNumeroNumeroFactura(numero);
                if(check == 0){
                    aux = false;
                    await dbFunctionsFactura.updateNumeroFacturaTmp();
                }else{
                    await dbFunctionsFactura.updateNumeroFacturaTmp();
                    numero = await dbFunctionsFactura.extraerNumeroFacturaTmp();
                }
            }
            factura = {
                        ...nuevaFactura, 
                        factura_qr: uniqid(), 
                        numero_factura: numero,
                        fecha_creacion_factura: listaDeServicios.time,
                        id_estado_factura: 2,
                        impreso: 0,
                    }
        }else if(nuevaFactura.id_tipo_factura == 3){
            //////////////Para recibos a contado////////////////////
            let aux = true, check;
            numero = await dbFunctionsFactura.extraerNumeroOrdenTrabajoTmp()
            while(aux){
                check = await dbFunctionsFactura.checkNumeroNumeroOrdenTrabajo(numero)
                if(check == 0){
                    aux = false;
                    await dbFunctionsFactura.updateOrdenTrabajoTmp();
                }else{
                    await dbFunctionsFactura.updateOrdenTrabajoTmp();
                    numero = await dbFunctionsFactura.extraerNumeroOrdenTrabajoTmp();
                }
            }
            factura = {
                        ...nuevaFactura, 
                        factura_qr: uniqid(), 
                        numero_orden_trabajo: numero,
                        fecha_creacion_orden_trabajo: listaDeServicios.time,
                        fecha_cancelacion: listaDeServicios.time,
                        id_estado_factura: 1,
                        impreso: 0,
                    }
        */
        //}else if(nuevaFactura.id_tipo_factura == 4){
            //////////////Para recibos a credito////////////////////
            let aux = true, check;
            numero = await dbFunctionsFactura.extraerNumeroOrdenTrabajoTmp()
            while(aux){
                check = await dbFunctionsFactura.checkNumeroNumeroOrdenTrabajo(numero)
                if(check == 0){
                    aux = false;
                    await dbFunctionsFactura.updateOrdenTrabajoTmp();
                    //console.log("/////////////////////////////////////", numero)
                }else{
                    await dbFunctionsFactura.updateOrdenTrabajoTmp();
                    numero = await dbFunctionsFactura.extraerNumeroOrdenTrabajoTmp();
                    //console.log("/////////////////////////////////////", numero)
                }
            }
            console.log("----------------------------", nuevaFactura)
            let tiempoAct = await dbFunctionsGenericos.getTime();
            factura = {
                        ...nuevaFactura, 
                        factura_qr: uniqid(), 
                        numero_orden_trabajo: numero,
                        fecha_creacion_orden_trabajo: tiempoAct,
                        id_estado_factura: 2,
                        impreso: 0,
                    }
        //}        
        //console.log(`la factura?`, factura.numero_orden_trabajo, nuevaFactura, nuevaFactura.id_tipo_factura)
        //TIPO PEDIDO 1 MESA
        //TIPO PEDIDO 2 DILIVIRI
        //TIPO PEDIDO 3 PICKUP
        if(factura.numero_factura != -1){
            pool.getConnection(function(err, connection){
                connection.query('INSERT INTO `tbl_factura` SET?',
                    factura, (err, result) => {
                    if (err) {
                        connection.release();
                        console.log(err)
                        resolve("3")
                    } else {
                        connection.release();
                        //console.log("@@@@@@@@@@@@@@@@@@@@@@@", numero)
                        if(nuevaFactura.id_tipo_factura == 1 || nuevaFactura.id_tipo_factura == 2){
                            envio = {
                                tipo: 1,
                                numero: numero
                            }
                        }else{
                            envio = {
                                tipo: 2,
                                numero: numero
                            }     
                        }
                        //console.log("y envio???", envio)
                        resolve(envio)
                    }
                });
            });
        }
    })
}

dbFunctionsFactura.anularFactura = async(idFactura) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`UPDATE tbl_factura SET estatus = 0, impreso = 1 WHERE id_factura = ${idFactura}`, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve("3");
                }else{
                    connection.release();
                    resolve("1");
                }
            })
        });
    })
}

dbFunctionsFactura.guardarDetallesFacturaItem = async(numero, items) =>{
    return new Promise((resolve, reject) => {
        let detalles = items.map(({id_item}) => [numero, id_item])
        //console.log(numero, items, detalles)
        pool.getConnection(function(err, connection){
            const sql = `INSERT INTO tbl_detalle_factura_item (id_factura, id_item) VALUES?`;
                connection.query(sql, [detalles], (err, result) => {
                    if (err) {
                        connection.release();
                        console.log(err);
                        resolve(-1)
                    } else {
                        connection.release();
                        resolve(1)
                    }
                })
        })
    });
}

dbFunctionsFactura.guardarRegistrosPagos = async(numero, pagos) => {
    //console.log(registros);
    return new Promise((resolve, reject) => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        let registros = pagos.map(({id_registro_divisa, id_banco, id_tipo_pago, numero_transferencia, tipo_registro, monto}) => [numero, id_registro_divisa, id_banco, id_tipo_pago, numero_transferencia, tipo_registro, monto, formattedDate])
        //console.log(numero, pagos)
        pool.getConnection(function(err, connection){
            const sql = `INSERT INTO tbl_registro_pago (id_factura, id_registro_divisa, id_banco, id_tipo_pago, numero_transferencia, tipo_registro, monto, fecha_monto) VALUES?`;
                connection.query(sql, [registros], (err, result) => {
                    if (err) {
                        connection.release();
                        console.log(err);
                        resolve(-1)
                    } else {
                        //console.log("??????????????????????????????")
                        connection.release();
                        resolve(1)
                    }
                })
        })
    });
}

dbFunctionsFactura.crearComanda = async(numero) => {
    let orden = await dbFunctionsFactura.extraerNumeroOrdenTmp();
    let idOrden = await dbFunctionsFactura.crearOrden(orden);
    await dbFunctionsFactura.updateOrdenTmp();
    let detallesFactura = await dbFunctionsFactura.extraeDetallesFacturaItem(numero);
    let detallesOrdenExisten = await dbFunctionsFactura.buscarDetallesOrden(detallesFactura)
    
    //////////////////////////FILTRAR detallesOrden//////////////////////////////
    let detallesFacturaAux = [], mod = 0;
    let detallesFacturaNumeros = detallesFactura.map(({id_detalle_factura_item}) => id_detalle_factura_item)

    detallesOrdenExisten.sort(function(a, b){return a - b})
    detallesFacturaNumeros.sort(function(a, b){return a - b})
    for(const detalle of detallesFacturaNumeros){
        mod = 0;
        for(const detalleExsite of detallesOrdenExisten){
            if(detalle == detalleExsite.id_detalle_factura_item){
                mod = 1;
            }
        }
        if(mod == 0){
            detallesFacturaAux.push(detalle)
        }
    }
    if(detallesFacturaAux.length > 0){
        await dbFunctionsFactura.crearDetalleOrden(detallesFacturaAux, idOrden);
    }

}

dbFunctionsFactura.cambiarDetalleFacturaItems = async(detallesFactura, idFactura) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            let registros = detallesFactura.map(({id_detalle_factura_item}) => [id_detalle_factura_item]);
            connection.query(`UPDATE tbl_detalle_factura_item SET id_factura = '${idFactura}' WHERE id_detalle_factura_item in (${registros})`, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve("3");
                }else{
                    connection.release();
                    resolve(1);
                }
            })
        });
    })
}

dbFunctionsFactura.crearOrden = async(numero) => {
    return new Promise(async(resolve, reject) => {
        //console.log(numero)
        let tiempo = await dbFunctionsGenericos.getTime()
        pool.getConnection(function(err, connection){
            connection.query('INSERT INTO `tbl_orden` SET?', {
                orden_numero: numero,
                fecha_emision: tiempo,
                qr_orden:     uniqid(),
            }, (err, result) => {
                if (err) {
                    connection.release();
                    console.log('no se pudo a agregar', err)
                    resolve(-1)
                } else {
                    connection.release();
                    console.log("8888888888888888888888888888888888888", result)
                    resolve(result.insertId)
                }
            });
        })
    });
}

dbFunctionsFactura.buscarDetallesOrden = async(detallesFactura) => {
    return new Promise((resolve, reject) => {
        let registros = detallesFactura.map(({id_detalle_factura_item}) => [id_detalle_factura_item]);
        //registros = [ 133, 134, 135, 136 ];
        pool.getConnection(function(err, connection){
            connection.query(`SELECT id_detalle_factura_item FROM tbl_detalle_orden WHERE id_detalle_factura_item in (${registros})`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE DETALLE FACTURA ITEM', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    //console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[", result)
                    resolve(result);
                }
            });
        })
    });
}

dbFunctionsFactura.extraeDetallesFacturaItem = async(numero) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT id_detalle_factura_item FROM tbl_detalle_factura_item WHERE id_factura = ${numero}`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE DETALLE FACTURA ITEM', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    resolve(result);
                }
            });
        })
    });
}

dbFunctionsFactura.facturasActivas = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_factura WHERE (id_estado_factura = 2) AND impreso = 0`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE DETALLE FACTURA ITEM', err);
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

dbFunctionsFactura.facturasActivasPorMesa = async(idMesa) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            let sql = `SELECT * FROM tbl_factura WHERE (id_estado_factura = 2) AND impreso = 0 AND id_mesa = ${idMesa}`;
            console.log(sql)
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT FACTURAS POR MESA', err);
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

dbFunctionsFactura.buscarMesa = async(numeroMesa) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            let sql = `SELECT * FROM tbl_mesa WHERE numero_mesa = ${numeroMesa}`;
            console.log(sql)
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT MESA', err);
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

dbFunctionsFactura.moverFacturasANuevaMesa = async(idMesa, facturas) => {
    return new Promise((resolve, reject) => {
        const stringQuerys = facturas.map((factura) =>{
                const stringQuery = `UPDATE tbl_factura SET id_mesa = ${idMesa} WHERE id_factura = ${factura.id_factura}; `;  
                    return stringQuery
            })
            const fullUpdateQuery = stringQuerys.join('');
            console.log(fullUpdateQuery)
            pool.getConnection(function(err, connection){
                connection.query(fullUpdateQuery, 
                function (err, result, fie) {
                    if (err) {
                        connection.release();
                        console.log(err)
                        resolve("3");
                    }else{
                        connection.release();
                        resolve("1");
                    }
                })
            });
        })
}

dbFunctionsFactura.facturasCanceladas = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT tbl_factura.id_factura, tbl_factura.estatus, tbl_factura.id_tipo_pedido, tbl_factura.id_mesa, tbl_factura.factura_qr, tbl_factura.id_estado_factura, tbl_factura.numero_factura, tbl_factura.numero_orden_trabajo, tbl_factura.id_cliente, tbl_factura.referencia, tbl_factura.numero_referencia, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.id_usuario_anulacion, tbl_factura.total_dolares, tbl_factura.total_bolivares, tbl_factura.total_pesos, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_pesos, tbl_factura.base_imponible_dolares, tbl_factura.base_imponible_bolivares, tbl_factura.tasa_bolivar_dia, tbl_factura.tasa_pesos_dia, tbl_factura.debe_dolares, ${servicios.date_format_left}fecha_creacion_factura${servicios.date_format_right} fecha_creacion_factura, ${servicios.date_format_left}fecha_creacion_orden_trabajo${servicios.date_format_right} fecha_creacion_orden_trabajo, ${servicios.date_format_left}fecha_cancelacion${servicios.date_format_right} fecha_cancelacion, tbl_factura.impreso, tbl_mesa.numero_mesa FROM tbl_factura LEFT JOIN tbl_mesa ON tbl_mesa.id_mesa = tbl_factura.id_mesa WHERE (id_estado_factura = 1 OR id_estado_factura = 3) AND impreso = 1`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE DETALLE FACTURA ITEM', err);
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

dbFunctionsFactura.facturasCreditoActivas = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_factura WHERE (id_estado_factura = 2) AND impreso = 0`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE DETALLE FACTURA ITEM', err);
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

dbFunctionsFactura.facturasCreditoCancelada = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query(`SELECT * FROM tbl_factura WHERE (id_estado_factura = 2) AND impreso = 1`, function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en SELECT DE DETALLE FACTURA ITEM', err);
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

dbFunctionsFactura.crearDetalleOrden = async(detalles, idOrden) => {
    return new Promise((resolve, reject) => {
        //console.log(numero, items, detalles)
        let registros = detalles.map((element) => [element, idOrden]);
        //console.log("000000", detalles, idOrden, registros)
        pool.getConnection(function(err, connection){
            const sql = `INSERT INTO tbl_detalle_orden (id_detalle_factura_item, id_orden) VALUES?`;
                connection.query(sql, [registros], (err, result) => {
                    if (err) {
                        connection.release();
                        console.log(err);
                        resolve(-1)
                    } else {
                        connection.release();
                        resolve(1)
                    }
                })
        })
    });
}

dbFunctionsFactura.extraerNumeroOrdenTmp = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query("SELECT numero_orden_tmp FROM `tbl_numero_orden_tmp`", function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    resolve(result[0].numero_orden_tmp);
                }
            });
        })
    });
}

dbFunctionsFactura.extraerNumeroFacturaTmp = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query("SELECT * FROM `tbl_numero_factura_tmp`", function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    resolve(result[0].numero_factura);
                }
            });
        })
    });
}

dbFunctionsFactura.extraerNumeroOrdenTrabajoTmp = async() => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query("SELECT * FROM `tbl_numero_orden_trabajo_tmp`", async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    resolve(result[0].numero_orden_trabajo);
                }
            });
        });
    });
}

dbFunctionsFactura.updateNumeroFacturaTmp = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura_tmp = 1', 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    resolve(-1);
                }else{
                    connection.release();
                    resolve(1);
                }
            })
        });
    })
}

dbFunctionsFactura.updateOrdenTrabajoTmp = async() => {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection){
                connection.query('UPDATE `tbl_numero_orden_trabajo_tmp` SET numero_orden_trabajo = numero_orden_trabajo + 1 WHERE id_numero_orden_trabajo_tmp = 1', 
                function (err, result, fie) {
                    if (err) {
                        connection.release();
                        console.log(err)
                        resolve(-1);
                    }else{
                        connection.release();
                        resolve(1);
                    }
                })
            });
        })
}

dbFunctionsFactura.updateOrdenTmp = async() => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            connection.query('UPDATE `tbl_numero_orden_tmp` SET numero_orden_tmp = numero_orden_tmp + 1 WHERE id_numero_orden_tmp = 1', 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve(-1);
                }else{
                    connection.release();
                    resolve(1);
                }
            })
        });
    })
} 

dbFunctionsFactura.checkNumeroNumeroFactura = async(numero) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT numero_factura FROM tbl_factura WHERE numero_factura = ${numero}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    //console.log("numero de factura", result)
                    //console.log(`numero de orden de trabajo ${result[0]}`)
                    if(result.length > 0){
                        connection.release();
                        //console.log("esta!!!", result)
                        resolve(1);
                    }else if(result.length <= 0){
                        connection.release();
                        resolve(0);
                    }
                    
                }
            });
        })
    })
}

dbFunctionsFactura.checkNumeroNumeroOrdenTrabajo = async(numero) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT numero_orden_trabajo FROM tbl_factura WHERE numero_orden_trabajo = ${numero}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    //console.log("numero de orden de trabajo", result)
                    //console.log(`numero de orden de trabajo ${result[0]}`)
                    if(result.length > 0){
                        //console.log("esta!!!", result)
                        resolve(1);
                    }else if(result.length <= 0){
                        resolve(0);
                    }
                    
                }
            });
        })
    })
}

dbFunctionsFactura.extraerIdOrdenTrabajo = async(numero) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT id_factura FROM tbl_factura WHERE numero_orden_trabajo = ${numero}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    //console.log("ppppppp", result)
                    resolve(result[0].id_factura)
                }
            })
        })
    })
}

dbFunctionsFactura.extraerIdFactura = async(numero) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT id_factura FROM tbl_factura WHERE numero_factura = ${numero}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    //console.log(result)
                    connection.release();
                    resolve(result[0].id_factura)
                }
            })
        })
    })
}

dbFunctionsFactura.extraerIdOrden = async(numero) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT id_orden FROM tbl_orden WHERE orden_numero = ${numero}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve(-1)
                }
                if(result){
                    connection.release();
                    //console.log("ppppppp", result)
                    resolve(result[0].id_orden)
                }
            })
        })
    })
}

dbFunctionsFactura.extraerItemsFactura = async(numero) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT tbl_detalle_factura_item.id_detalle_factura_item, tbl_detalle_factura_item.id_item, tbl_item.item_nombre, tbl_item.item_precio FROM tbl_detalle_factura_item LEFT JOIN tbl_item ON tbl_item.id_item = tbl_detalle_factura_item.id_item WHERE tbl_detalle_factura_item.id_factura = ${numero}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve("-1")
                }
                if(result){
                    connection.release();
                    //console.log("ppppppp", result)
                    resolve(result)
                }
            })
        })
    })
}

dbFunctionsFactura.extraerItemsGrupoFacturas = async(idFacturas) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT tbl_detalle_factura_item.id_detalle_factura_item, tbl_detalle_factura_item.id_item, tbl_item.item_nombre, tbl_item.item_precio FROM tbl_detalle_factura_item LEFT JOIN tbl_item ON tbl_item.id_item = tbl_detalle_factura_item.id_item WHERE tbl_detalle_factura_item.id_factura in ${idFacturas}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve("-1")
                }
                if(result){
                    connection.release();
                    //console.log("ppppppp", result)
                    resolve(result)
                }
            })
        })
    })
}

dbFunctionsFactura.extraerFactura = async(numero) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            connection.query(`SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.numero_orden_trabajo, tbl_factura.id_cliente, tbl_factura.referencia, tbl_factura.numero_referencia, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.id_usuario_anulacion, tbl_factura.total_dolares, tbl_factura.total_bolivares, tbl_factura.total_pesos, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.base_imponible_bolivares, tbl_factura.tasa_bolivar_dia, tbl_factura.tasa_pesos_dia, tbl_factura.debe_dolares, tbl_factura.fecha_creacion_factura, tbl_factura.fecha_creacion_orden_trabajo, tbl_factura.fecha_cancelacion, tbl_factura.impreso, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cliente_cedula, tbl_cliente.cliente_telefono, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula, tbl_usuario.usuario_telefono, tbl_tipo_factura.tipo_factura_nombre FROM tbl_factura LEFT JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura WHERE tbl_factura.id_factura = ${numero}`, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve("-1")
                }
                if(result){
                    connection.release();
                    //console.log("ppppppp", result)
                    resolve(result)
                }
            })
        })
    })
}

dbFunctionsFactura.cancelarFactura = async(modificacion) => {
    return new Promise(async (resolve, reject) => {
        pool.getConnection(async function(err, connection){
            let query;
            let dateFormat = await dbFunctionsGenericos.dateFormat();
            console.log("!!!!!!!!!!!!!!", modificacion)
            if(modificacion.id_tipo_factura == 4){
              query = `UPDATE tbl_factura SET impreso = 1, debe_dolares = ${modificacion.debe_dolares}, id_tipo_factura = ${modificacion.id_tipo_factura}, referencia = '${modificacion.referencia}', id_estado_factura = 3, total_bolivares = ${modificacion.total_bolivares}, total_pesos = ${modificacion.total_pesos}, total_dolares = ${modificacion.total_dolares}, tasa_pesos_dia = ${modificacion.tasa_pesos_dia}, tasa_bolivar_dia = ${modificacion.tasa_bolivar_dia} WHERE id_factura = ${modificacion.id_factura}`
            }else if(modificacion.id_tipo_factura == 3){
              query = `UPDATE tbl_factura SET tasa_bolivar_dia = ${modificacion.tasa_bolivar_dia}, tasa_pesos_dia = ${modificacion.tasa_pesos_dia}, total_pesos = ${modificacion.total_pesos}, total_bolivares = ${modificacion.total_bolivares}, total_dolares = ${modificacion.total_dolares}, id_cliente = ${modificacion.id_cliente}, impreso = 1, debe_dolares = 0, fecha_cancelacion = '${dateFormat}', id_tipo_factura = ${modificacion.id_tipo_factura}, id_estado_factura = 1 WHERE id_factura = ${modificacion.id_factura}`
            }else{
              query = `UPDATE tbl_factura SET tasa_bolivar_dia = ${modificacion.tasa_bolivar_dia}, tasa_pesos_dia = ${modificacion.tasa_pesos_dia}, total_pesos = ${modificacion.total_pesos}, total_bolivares = ${modificacion.total_bolivares}, total_dolares = ${modificacion.total_dolares}, id_cliente = ${modificacion.id_cliente}, impreso = 1, debe_dolares = ${modificacion.debe_dolares}, id_tipo_factura = ${modificacion.id_tipo_factura}  WHERE id_factura = ${modificacion.id_factura}`
            }
            console.log(query)
            connection.query(query, async function (err, result, fields) {
                if (err) {
                    connection.release();
                    console.log('ERROR en creacion de numero de factura', err);
                    resolve("-1")
                }
                if(result){
                    connection.release();
                    resolve("1")
                }
            })
        })
    })
}

dbFunctionsFactura.modificarPago = async(pagos) => {
    return new Promise((resolve, reject) => {
    const stringQuerys = pagos.map((pago) =>{
            const stringQuery = `UPDATE tbl_registro_pago SET id_registro_divisa = ${pago.id_registro_divisa}, id_banco = ${pago.id_banco}, id_tipo_pago = ${pago.id_tipo_pago}, tipo_registro = ${pago.tipo_registro}, monto = ${pago.monto}, numero_transferencia = ${pago.numero_transferencia}, fecha_monto = '${servicios.formatTime}' WHERE id_registro_pago = ${pago.id_registro_pago}; `;  
                return stringQuery
        })
        const fullUpdateQuery = stringQuerys.join('');
        console.log(fullUpdateQuery)
        pool.getConnection(function(err, connection){
            connection.query(fullUpdateQuery, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve("3");
                }else{
                    connection.release();
                    resolve("1");
                }
            })
        });
    })
}

dbFunctionsFactura.eliminarPago = async(idPagos) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM tbl_registro_pago WHERE id_registro_pago in (${idPagos})`
        pool.getConnection(function(err, connection){
            connection.query(query, 
            function (err, result, fie) {
                if (err) {
                    connection.release();
                    console.log(err)
                    resolve("3");
                }else{
                    connection.release();
                    resolve("1");
                }
            })
        });
    })
}

module.exports = dbFunctionsFactura;