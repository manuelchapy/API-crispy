const clienteCtrl = {};
const dbFunctionsClientes = require("../src/functions/DB_functions_clientes");

clienteCtrl.clientes = async(req, res) =>{
    let clientes = await dbFunctionsClientes.clientes()
    res.send(clientes);
};

clienteCtrl.verificarCliente = async(req, res) =>{
    let verificar = await dbFunctionsClientes.verificarCliente(req.body.cliente_cedula);
    res.send(verificar)
}

clienteCtrl.agregarCliente = async(req, res) =>{
    let resp = await dbFunctionsClientes.agregarCliente(req.body)
    res.send(resp);
};

clienteCtrl.documentos = async(req, res) =>{
    let documentos = await dbFunctionsClientes.documentos()
    res.send(documentos);
};

clienteCtrl.modificarCliente = async(req, res) =>{
    let resp = await dbFunctionsClientes.modificarCliente(req.body)
    res.send(resp);
};

module.exports = clienteCtrl;