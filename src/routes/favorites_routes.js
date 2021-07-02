const express = require("express");
const conexion = require("../conexions");

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM favorites";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.send("Error al obtener los favoritos");
    } else {
      res.json(result);
    }
  });
});

router.get("/:id", (req, res) => {
  const idfavorite = req.params.id;
  const sql = "SELECT * FROM favorites Where id=?";
  conexion.query(sql, [idfavorite], (err, result) => {
    if (err) {
      res.send("Error al obtener los favoritos");
    } else {
      res.json(result);
    }
  });
});

router.post("/:id", (req, res) => {
  const favorite = req.body.favorite;

  const sql = `INSERT INTO favorites (favorite) 
                  VALUES (?)`;
  conexion.query(sql, [favorite], (err, result) => {
    if (err) {
      res.send("Error al insertar un favorito");
    } else {
      res.send("Favorito agregado");
    }
  });
});

router.delete("/:id", (req, res) => {
  const idfavorite = req.params.id;
  const sql = "DELETE FROM favorites WHERE id=?";
  conexion.query(sql, [idfavorite], (err, result) => {
    if (err) {
      res.send("Error al eliminar el favorito");
    } else {
      res.send("Usuario Eliminado");
    }
  });
});

module.exports = router;
