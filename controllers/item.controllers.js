const itemCtrl = {};
const dbFunctionsCategorias = require("../src/functions/DB_functions_categorias");
const dbFunctionsGenericos = require("../src/functions/DB_functions_genericos");
const dbFunctionsItem = require("../src/functions/DB_functions_items");

itemCtrl.items = async(req, res) =>{
    let items = await dbFunctionsItem.items()
    let itemsOrdenadosPorCategoria = await dbFunctionsGenericos.ordenarCategoriasItems(items)
    res.send(itemsOrdenadosPorCategoria);
}

itemCtrl.buscarItem = async(req, res) =>{
    let item = await dbFunctionsItem.buscarItem(req.params.id_item)
    res.send(item);
}

itemCtrl.itemsPorCategoria = async(req, res) =>{
    let items = await dbFunctionsItem.items()
    let categorias = await dbFunctionsCategorias.categorias()
    categorias.map(categoria => categoria.items = [])
    categorias.forEach(categoria => {
        items.forEach(item => {
            if(item.id_categoria == categoria.id_categoria){
                categoria.items.push({item})
            }
        })
    })
    res.send(categorias);
}

itemCtrl.itemsAnulados = async(req, res) =>{
    let items = await dbFunctionsItem.itemsAnulados()
    res.send(items);
}

itemCtrl.crearItem = async(req, res) =>{
    let resp = await dbFunctionsItem.crearItem(req.body)
    res.send(resp);
}

itemCtrl.modificarItem = async(req, res) =>{
    let resp = await dbFunctionsItem.modificarItem(req.body)
    res.send(resp);
}

itemCtrl.anularItem = async(req, res) =>{
    let resp = await dbFunctionsItem.anularItem(req.body.id_item)
    res.send(resp);
}

itemCtrl.activarItem = async(req, res) =>{
    let resp = await dbFunctionsItem.activarItem(req.body.id_item)
    res.send(resp);
}



module.exports = itemCtrl;