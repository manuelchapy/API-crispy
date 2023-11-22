const usuarioCtrl = {};
const dbFunctionsUsuario = require("../src/functions/DB_functions_usuarios");
const dbFunctionsTareas = require("../src/functions/DB_function_tarea");
const uniqid = require('uniqid');
const random = require("random-integer");
const plantilla_sesion_usuario = require('../src/models/modelos_usuarios/plantilla_sesiones_usuario');
const servicios = require("../src/functions/services")

usuarioCtrl.crearUsuario = async(req, res) =>{
    let check = await dbFunctionsUsuario.checkUsuario(req.body.usuario_username, 1);
    console.log("!!!!!!!!!!!", check)
    if(check == "0"){
        res.send("-1")
    }else{
        let resp = await dbFunctionsUsuario.crearUsuario(req.body)
        res.send("1");
    }
};

usuarioCtrl.buscarUsuario = async(req, res) =>{
    let usuario = await dbFunctionsUsuario.buscarUsuario(req.params.id_usuario)
    res.send(usuario);
};

usuarioCtrl.usuarios = async(req, res) =>{
    let usuarios = await dbFunctionsUsuario.usuarios()
    res.send(usuarios);
};

usuarioCtrl.modificarUsuario = async(req, res) =>{
    let resp = await dbFunctionsUsuario.modificarUsuario(req.body.usuario)
    res.send(resp);
};

usuarioCtrl.login = async(req, res) =>{
    const { usuario_username, usuario_password } = req.body;
    //console.log(usuario_username)
    let usuario = await dbFunctionsUsuario.checkUsuario(req.body.usuario_username, 2)
    //console.log(usuario, req.body)
    if(usuario == '0'){
        res.send("0")
    }else {
        if(usuario.usuario_password == usuario_password){

            plantilla_sesion_usuario.sesiones.forEach(function(sesion, index){
                if(sesion.id_usuario == usuario.id_usuario){
                    plantilla_sesion_usuario.sesiones.splice(index);
                }
            })

            let usuario_obj = {
                id: random(1, 10000),
                id_usuario: usuario.id_usuario,
                session_token: uniqid(),
                usuario_nombre: usuario.usuario_nombre,
                usuario_apellido: usuario.usuario_apellido,
                usuario_cedula: usuario.usuario_cedula,
                usuario_telefono: usuario.usuario_telefono,
                usuario_username: usuario.usuario_username,
                id_rol: usuario.id_rol
            }
            plantilla_sesion_usuario.sesion_usuario = {...usuario_obj};
            plantilla_sesion_usuario.sesiones.push(plantilla_sesion_usuario.sesion_usuario);
            console.log("!!!!!!", plantilla_sesion_usuario.sesiones)
            res.send(plantilla_sesion_usuario.sesion_usuario)
        }else{
            //console.log("!!!!!! en 0", plantilla_sesion_usuario.sesiones)
            res.send("0")
        }
    }
}

usuarioCtrl.logout = async(req, res) =>{
    plantilla_sesion_usuario.sesiones.forEach(function(sesion, index){
        if((sesion.id_usuario == req.body.id_usuario) && (sesion.session_token == req.body.session_token)){
            plantilla_sesion_usuario.sesiones.splice(index);
        }
    })
    console.log("*****", plantilla_sesion_usuario.sesiones)
    res.send("1")
}

usuarioCtrl.verificarToken = async(req, res) =>{
    if(req.body.session_token === undefined || req.body.session_token == 'undefined'){
        res.send("0")
    }else{
        let respSession = "x";
        plantilla_sesion_usuario.sesiones.forEach(function(sesion, index){
            if(sesion.session_token == req.body.session_token){
                respSession = "1";
            }
        })
        //console.log("*****", plantilla_sesion_usuario.sesiones)
        res.send(respSession)
    }
}

usuarioCtrl.adminSesiones = async(req, res) =>{
    console.log("1111111111", req.body)
    if(req.body.session_token === undefined || req.body.session_token == 'undefined'){
        res.send("x")
    }else{
        console.log("entro en el else")
        let checkTokenSesion = "0"
        let session_token = req.body.session_token
        console.log("verifica los lets")
        plantilla_sesion_usuario.sesiones.forEach(sesion =>{
            console.log("hace el loop")
            if(sesion.session_token == session_token){
                checkTokenSesion = "1"
            }
        })
        console.log("verificar el checkTokenSesion", checkTokenSesion)
        let checkRolTarea = await dbFunctionsTareas.checkPasoControlador(req.body.id_rol, req.body.id_tarea)
        console.log(checkRolTarea, checkTokenSesion)
        if(checkRolTarea == "1" && checkTokenSesion == "1"){
            console.log("entro en 1")
            res.send("1")
        }else if(checkRolTarea == "1" && checkTokenSesion == "0"){
            console.log("entro en x")
            res.send("x")
        }else{
            console.log("entro en 0")
            res.send("0")
        }
    }
}

usuarioCtrl.checkPasswordAnularItemPedido = async(req, res) =>{
    if(req.body.clave == servicios.anular_item_pedido){
        res.send("1")
    }else{
        res.send("0")
    }
}

usuarioCtrl.checkPasswordAnularFactura = async(req, res) =>{
    if(req.body.clave == servicios.anular_factura){
        res.send("1")
    }else{
        res.send("0")
    }
}




module.exports = usuarioCtrl;