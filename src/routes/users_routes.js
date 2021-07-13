const express = require("express");
const conexion = require("../conexions");

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.send("Error al obtener los usuarios");
    } else {
      res.json(result);
    }
  });
});

router.get("/:id", (req, res) => {
  const iduser = req.params.id;
  const sql = "SELECT * FROM users Where id=?";
  conexion.query(sql, [iduser], (err, result) => {
    if (err) {
      res.send("Error al obtener los usuarios");
    } else {
      res.json(result);
    }
  });
});

router.post("/:id", (req, res) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  const sql = `INSERT INTO users (name, lastname,email,password) 
                VALUES (?,?,?,?)`;
  conexion.query(sql, [name, lastname, email, password], (err, result) => {
    if (err) {
      res.send("Error al insertar un usuarios");
    } else {
      res.send("Usuario agregado");
    }
  });
});

router.put("/account/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email;
  const sql = "UPDATE users SET name=?,lastname=?,email=? WHERE id=?";
  const sql1 = "SELECT * FROM users WHERE id=?";
  conexion.query(sql, [name, last, email, id], (err, result) => {
    if (err) {
      res.status(401).json({ message: "Error al cambiar los datos" });
    } else {
      conexion.query(sql1, [id], (err, result1) => {
        if (err) {
          res.status(401).json({ message: "Error al cambiar los datos" });
        } else {
          console.log("----------------------------");
          console.log(result1);
          console.log("----------------------------");

          req.session.user = {
            user: {
              id: result1[0].id,
              name: result1[0].name,
              lastname: result1[0].lastname,
              email: result1[0].email,
            },
          };
          res.status(200).json({
            message: "Usuario actualizado",
            user: {
              id: result1[0].id,
              name: result1[0].name,
              lastname: result1[0].lastname,
              email: result1[0].email,
            },
          });
        }
      });
    }
  });
});

router.put("/password/:id", (req, res) => {
  const id = req.params.id;
  const password = req.body.password;
  const newPassword = req.body.newpassword;
  const sql = "SELECT * FROM users WHERE id=?";
  const sql1 = `UPDATE users SET password=? WHERE id=?`;

  conexion.query(sql, [id], (err, result) => {
    if (err) {
      res.status(401).json({ message: "Error al cambiar contraseña" });
    } else {
      if (result[0].password == password) {
        conexion.query(sql1, [newPassword, id], (err, result) => {
          if (err) {
            res.status(401).json({ message: "Error al cambiar contraseña" });
          } else {
            res.status(200).json({ message: "Contraseña cambiada" });
          }
        });
      } else {
        res.status(401).json({ message: "La contraseña actual es incorrecta" });
      }
    }
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const password = req.body.deletePassword;
  const sql = "DELETE FROM users WHERE id=?";
  const sql1 = "SELECT * FROM users WHERE id=?";

  conexion.query(sql1, [id], (err, result) => {
    if (err) {
      res.status(401).json({ message: "Error al eliminar al usuario" });
    } else {
      if (result.length == 1 && result[0].password == password) {
        conexion.query(sql, [id], (err, result) => {
          if (err) {
            res.status(401).json({ message: "Error al eliminar al usuario" });
          } else {
            req.session.destroy((err) => {
              if (err) {
                res
                  .status(500)
                  .json({ message: "Error en el cierre de sesion" });
              } else {
                res.status(200).json({ message: "Cuenta eliminada", user: "" });
              }
            });
            // res.status(200).json({ message: "Usuario eliminado" });
          }
        });
      }
    }
  });

  /*  conexion.query(sql, [iduser], (err, result) => {
    if (err) {
      res.send("Error al elminar el usuario");
    } else {
      res.send("Usuario Eliminado");
    }
  }); */
});

module.exports = router;
