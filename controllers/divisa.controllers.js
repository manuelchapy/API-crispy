const divisaCtrl = {};
const dbFunctionsDivisas = require("../src/functions/DB_functions_divisas")

divisaCtrl.divisas = async(req, res) =>{
    let divisas = await dbFunctionsDivisas.divisas()
    res.send(divisas);
};

divisaCtrl.registroDivisas = async(req, res) =>{
    let registroDivisas = await dbFunctionsDivisas.registroDivisas()
    res.send(registroDivisas);
};

divisaCtrl.historialDivisas = async(req, res) =>{
    let historial = await dbFunctionsDivisas.historialDivisas(req.body.id_divisa)
    res.send(historial)
}

divisaCtrl.agregarDivisa = async(req, res) =>{
    await dbFunctionsDivisas.agregarDivisa(req.body);
    res.send('1');
};

divisaCtrl.agregarTasaDivisa= async(req, res) =>{
    let tasa = await dbFunctionsDivisas.agregarTasaDivisa(req.body);
    res.send(tasa);
}

module.exports = divisaCtrl