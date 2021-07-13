const express = require("express");
const conexion = require("../conexions");
const router = express.Router();

router.get("/check", (req, res) => {
  if (req.session.user) {
    res.json({ message: "ok", data: req.session.user });
  } else {
    res.json({ message: "error", data: { user: null } });
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
            lastname: result[0].lastname,
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
            lastname: result[0].lastname,
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

router.post("/register", (req, res) => {
  name1 = req.body.name.charAt(0).toUpperCase();
  lastname = req.body.lastname.charAt(0).toUpperCase();
  email = req.body.email;
  password = req.body.password;
  const sql = `SELECT * FROM users WHERE email=? `;
  const sql2 = `INSERT INTO users 
                (name,lastname,email,password) 
                  VALUES (?,?,?,?)`;

  conexion.query(sql, [email], (err, result) => {
    if (err) {
      res.status(401).json({ message: "Error al crear usuario" });
    } else if (result.length === 0) {
      conexion.query(
        sql2,
        [name1, lastname, email, password],
        (err, result) => {
          if (err) {
            res.status(401).json({ message: "Erro registro" });
            console.log("error al crear usuario");
          } else {
            conexion.query(sql, [email], (err, result1) => {
              if (err) {
                res.status(401).json({ message: "Erro registro" });
              } else {
                console.log(result1);
                req.session.user = {
                  user: {
                    id: result1[0].id,
                    name: result1[0].name,
                    lastname: result1[0].lastname,
                    email: result1[0].email,
                  },
                };
                res.status(200).json({
                  message: "Usuario valido",
                  user: {
                    id: result1[0].id,
                    name: result1[0].name,
                    lastname: result1[0].lastname,
                    email: result1[0].email,
                  },
                });
                console.log("Usuario Agregado");
              }
            });
          }
        }
      );
    } else {
      res.status(401).json({ message: "El mail ya se encuentra registrado" });
    }
  });
});

module.exports = router;
