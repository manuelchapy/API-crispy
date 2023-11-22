const rolCtrl = {};
const dbFunctionsRoles = require("../src/functions/DB_function_roles");

rolCtrl.roles = async(req, res) =>{
    let roles = await dbFunctionsRoles.roles();
    res.send(roles);
}

rolCtrl.crearRol = async(req, res) =>{
    let roles = await dbFunctionsRoles.crearRol(req.body);
    res.send(roles);
}

rolCtrl.editarRol = async(req, res) =>{
    let roles = await dbFunctionsRoles.editarRol(req.body);
    res.send(roles);
}

rolCtrl.tareaRoles = async(req, res) =>{
    let roles = await dbFunctionsRoles.editarRol(req.body);
    res.send(roles);
}



module.exports = rolCtrl;