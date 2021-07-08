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
  const sql = "SELECT * FROM favorites Where id_favorite=?";
  conexion.query(sql, [idfavorite], (err, result) => {
    if (err) {
      res.send("Error al obtener los favoritos");
    } else {
      res.json(result);
    }
  });
});

router.post("/", (req, res) => {
  const id = req.body.id;
  const path = req.body.path;
  const title = req.body.title;
  const overview = req.body.overview;
  const vote = req.body.vote;

  const sql1 = "SELECT * FROM favorites WHERE id_favorite=?";
  conexion.query(sql1, [id], (err, result) => {
    if (err) {
      res.send("Error al insertar un favorito");
    } else {
      if (result.length === 1) {
        console.log("Este ya lo agrege");
      } else {
        const sql2 = `INSERT INTO favorites 
              (id_favorite,backdrop_path,title,overview,vote_average) 
                  VALUES (?,?,?,?,?)`;
        conexion.query(
          sql2,
          [id, path, title, overview, vote],
          (err, result) => {
            if (err) {
              res.send("Error al insertar un favorito");
            } else {
              console.log(result);
              console.log("favorito agregado");
              res.send({ message: "Favorito Agregado", id });
            }
          }
        );
      }
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
