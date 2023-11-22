const dbFunctionsFacturaData = {};

dbFunctionsFacturaData.agruparItemsTotalFactura = async(items) => {
    return new Promise((resolve, reject) => {
        let agrupados = {};
        items.forEach( item => {
            if( !agrupados.hasOwnProperty(item.id_item)){
                agrupados[item.id_item] = {
                    id_item: item.id_item,
                    //id_detalle_factura_item: item.id_detalle_factura_item,
                    item_precio: item.item_precio,
                    item_nombre: item.item_nombre,
                    cantidad: 1
                }
            }
                if(agrupados[item.id_item].id_item == item.id_item){
                    agrupados[item.id_item].item_precio = agrupados[item.id_item].item_precio + item.item_precio
                    agrupados[item.id_item].cantidad ++
                } 
            })
        resolve(agrupados);
    })
}


module.exports = dbFunctionsFacturaData;