const categoriaCtrl = {};
const dbFunctionsCategorias = require("../src/functions/DB_functions_categorias")

categoriaCtrl.categorias = async(req, res) =>{
    let categorias = await dbFunctionsCategorias.categorias()
    res.send(categorias);
};

module.exports = categoriaCtrl ;