const express = require("express");
const conexion = require("../conexions");
const router = express.Router();

router.get("/check", (req, res) => {
  if (req.session.user) {
    res.json({ message: "ok", data: req.session.user });
  } else {
    res.json({ message: "error" });
  }
});

router.post("/", (req, res) => {
  email = req.body.email;
  password = req.body.password;

  const sql = `SELECT * FROM users WHERE email=? AND password=? `;

  conexion.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("Error en la conexion auth");
    } else {
      if (result.length === 1) {
        req.session.user = {
          user: {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
          },
        };

        console.log(req.session.user);

        console.log(result);

        res.status(200).json({
          message: "Usuario valido",
          user: {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
          },
        });
      } else
        res.status(401).json({ message: "Email y/o contraseña incorrecta" });
    }
  });
});

router.delete("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Erro en el cierre de sesion" });
    } else {
      res.status(200).json({ message: "Sesion Cerrada" });
    }
  });
});

module.exports = router;
