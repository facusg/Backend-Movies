const express = require("express");
const conexion = require("../conexions");
const router = express.Router();

router.post("/", (req, res) => {
  email = req.body.email;
  password = req.body.password;

  const sql = `SELECT name,email FROM users WHERE email=? AND password=? `;

  conexion.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("Error en la conexion auth");
    } else {
      if (result.length === 1) {
        req.session.user = { name: result[0].name };
        console.log(req.session.user);
        console.log(result);
        res.json({ message: "Usuario valido" });
      } else res.json({ auth: false, message: "Usuario incorrecto" });
    }
  });
});

module.exports = router;
