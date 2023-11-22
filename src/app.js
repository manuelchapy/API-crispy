const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const session = require('express-session');

app.set('port', process.env.PORT || 9000);

// middlewares
app.use(express.urlencoded({extended: false}));	
app.use(cors()); //cada vez que llegue una petición a mi servidor va permitir poder enviar y recibir datos
app.use(express.json()); //desde mi servidor se puede ver info en formato json y string
app.use(session({
	secret: '24781279_provida',
	resave: true,
	sevenUninitialized: true
}));

app.use(require('../routes'));
app.use(require('../routes/administracionFiscal'))
app.use(require('../routes/index'));
app.use(require('../routes/banco'));
app.use(require('../routes/delivery'));
app.use(require('../routes/pickups'));
app.use(require('../routes/roles'));
app.use(require('../routes/tarea'));
app.use(require('../routes/metodosPagos'));
app.use(require('../routes/facturacion'));
app.use(require('../routes/divisa'));
app.use(require('../routes/item'));
app.use(require('../routes/cliente'));
app.use(require('../routes/mesa'));
app.use(require('../routes/categorias'));
app.use(require('../routes/usuario'));
app.use(require('../routes/ordenes'));
app.use('./src/functions/DB_functions',express.static(path.join(__dirname, '../src/functions')));


module.exports = app;