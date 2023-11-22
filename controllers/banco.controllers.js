const bancoCtrl = {};
const dbFunctionsBancos = require("../src/functions/DB_functions_bancos")

bancoCtrl.bancos = async(req, res) =>{
    let bancos = await dbFunctionsBancos.bancos()
    res.send(bancos);
};

module.exports = bancoCtrl;