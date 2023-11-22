const tareaCtrl = {};
const dbFunctionsTareas = require("../src/functions/DB_function_tarea");

tareaCtrl.tareas = async(req, res) =>{
    let tareas = await dbFunctionsTareas.tareas();
    res.send(tareas);
}

tareaCtrl.crearTarea = async(req, res) =>{
    let tareas = await dbFunctionsTareas.crearTarea(req.body);
    res.send(tareas);
}

tareaCtrl.editarTarea = async(req, res) =>{
    let tareas = await dbFunctionsTareas.editarTarea(req.body);
    res.send(tareas);
}

tareaCtrl.tareasRol = async(req, res) =>{
    let tareas = req.body.tareas;
    let idRol = req.body.id_rol;
    //console.log(tareas, idRol)
    let resp = await dbFunctionsTareas.tareasRol(tareas, idRol);
    res.send(resp);
}

module.exports = tareaCtrl;