const mysql = require('mysql2');

//local host
/*
const connection = mysql.createConnection({
	host: 'localhost',
	database: 'restaurantedb',
	user: 'root',
	password: ''
});
*/
const pool = mysql.createPool({
	host: '',
	user: '',
	database: '',
	waitForConnections: true,
	connectionLimit: 200,
	maxIdle: 100, // máximo de conexiones inactivas, el valor predeterminado es el mismo que `connectionLimit` 
	//idleTimeout: 60000, // tiempo de espera de las conexiones inactivas, en milisegundos, el valor predeterminado 60000 
	queueLimit: 0,
	multipleStatements: true // Agregar esta opción para permitir múltiples consultas en una sola llamada.
  });
/*
pool.connect(function (error) {
	if (error) {
		throw error;
	} else {
		console.log('DB Connected')
	}
}),
*/
module.exports = pool;