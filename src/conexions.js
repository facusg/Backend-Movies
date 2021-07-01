const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "moviesreact",
});

conexion.connect((err) => {
  if (err) {
    console.log("Error en la conexion");
  } else {
    console.log("Conexion a la base de datos exitosa");
  }
});

module.exports = conexion;
