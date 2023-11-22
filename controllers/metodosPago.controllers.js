const metodosPagoCtrl = {};
const dbFunctionsMetodosPago = require("../src/functions/DB_functions_metodos_pago")

metodosPagoCtrl.metodosPagos = async(req, res) =>{
    let metodosPagos = await dbFunctionsMetodosPago.metodosPago()
    res.send(metodosPagos);
};

module.exports = metodosPagoCtrl;