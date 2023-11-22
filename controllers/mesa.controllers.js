const mesaCtrl = {};
const dbFunctionsMesa = require("../src/functions/DB_functions_mesas");
const dbFunctionsGenericos = require("../src/functions/DB_functions_genericos")

mesaCtrl.mesas = async(req, res) =>{
    
    let mesas = await dbFunctionsMesa.mesas()
    //console.log("!!!!", mesas)
    mesas.map(mesa => mesa.facturas = [])
    mesas.map(mesa => mesa.primera_orden = {})
    mesas.map(mesa => mesa.ultima_orden = {})
    let idMesas = mesas.map(({id_mesa}) => id_mesa);
    let facturasPorMesa = await dbFunctionsMesa.facturasPorMesa(idMesas);
    let idFacturas = facturasPorMesa.map(({id_factura}) => id_factura);
    let registrosItemsPorFactura = [];
    if(idFacturas.length > 0){
        registrosItemsPorFactura = await dbFunctionsGenericos.registrosItemsPorFactura(idFacturas);
    }   
    let ultimaOrdenDeMesa = await dbFunctionsGenericos.ultimaOrdenDeMesa(idMesas);
    let primeraOrdeDeMesa = await dbFunctionsGenericos.primeraOrdenDeMesa(idMesas);
    //console.log(ultimaOrdenDeMesa)
    facturasPorMesa.map(factura => factura.items = [])

    facturasPorMesa.forEach(factura => {
        for(const item of registrosItemsPorFactura){
            if(factura.id_factura == item.id_factura){
                factura.items.push(item);
            }
        }
    })
    facturasPorMesa.forEach(factura => {
        for(const mesa of mesas){
            //console.log(mesa.id_mesa)
            if(factura.id_mesa == mesa.id_mesa){
                mesa.facturas.push(factura);
            }
            for(const orden of primeraOrdeDeMesa){
                if(orden.id_mesa == mesa.id_mesa){
                    mesa.primera_orden = orden;
                }
            }
            for(const orden of ultimaOrdenDeMesa){
                if(orden.id_mesa == mesa.id_mesa){
                    mesa.ultima_orden = orden;
                }
            }
        }

    });
    res.send(mesas);
};

mesaCtrl.crearMesa = async(req, res) => {
    return new Promise((resolve, reject) => {
        let registros = detalles.map((element) => [element, idOrden]);
        pool.getConnection(function(err, connection){
            const sql = `INSERT INTO tbl_mesa (numero_mesa) VALUES?`;
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

mesaCtrl.mesa = async(req, res) => {
    let facturasPorMesa = await dbFunctionsMesa.FacturasDeUnaMesa(req.body.id_mesa);
    let idFacturas = facturasPorMesa.map(({id_factura}) => id_factura);
    let registrosItemsPorFactura = await dbFunctionsGenericos.registrosItemsPorFactura(idFacturas);
    /*registrosItemsPorFactura.forEach(obj => {
        if (!groupedItems[obj.id_item]) {
          groupedItems[obj.id_item] = {
            id_item: obj.id_item,
            item_nombre: obj.item_nombre,
            conteo: 0,
            acumulado_precio: 0
          };
        }
      
        groupedItems[obj.id_item].conteo++;
        groupedItems[obj.id_item].acumulado_precio += obj.item_precio;
    });
      // Convertir el objeto agrupado de nuevo en un array
      const result = Object.values(groupedItems);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!", result)*/
    let mesa = await dbFunctionsMesa.mesa(req.body.id_mesa);
    let detalles_mesa = {id_mesa: req.body.id_mesa, numero_mesa: mesa[0].numero_mesa, numero_referencia: facturasPorMesa[0].numero_referencia};
    facturasPorMesa.map(factura => factura.items = [])
    facturasPorMesa.map(factura => factura.items_agrupados = [])
    facturasPorMesa.forEach(factura => {
        for(const item of registrosItemsPorFactura){
            if(factura.id_factura == item.id_factura){
                factura.items.push(item);
            }
        }
    })
    let itemsAgrupados = {};
    facturasPorMesa.forEach(registro =>{
        itemsAgrupados = {};
        //console.log("PPPPPPPPPPPPPPPP", registro)
        registro.items.forEach(item => {
            if (!itemsAgrupados[item.id_item]) {
                itemsAgrupados[item.id_item] = {
                  id_item: item.id_item,
                  item_nombre: item.item_nombre,
                  conteo: 0,
                  acumulado_precio: 0,
                  item_precio: item.item_precio
                };
              }
              itemsAgrupados[item.id_item].conteo++;
              itemsAgrupados[item.id_item].acumulado_precio += item.item_precio;
              console.log(itemsAgrupados)
        })
        
        const result = Object.values(itemsAgrupados);
        registro.items_agrupados = result
    })
    let data = {
        detalles_mesa: detalles_mesa,
        facturas: facturasPorMesa
    }
    res.send(data);
}

module.exports = mesaCtrl;