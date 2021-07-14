const express = require("express");
const conexion = require("../conexions");

const router = express.Router();

router.get("/:id", (req, res) => {
  const sql3 = `SELECT idAPI,backdrop_path,title,overview,vote_average,trailerUrl FROM usersfavorites 
                LEFT JOIN moviesyseries 
                ON moviesyseries.idAPI=usersfavorites.idfavorite
                WHERE idser=?`;

  conexion.query(sql3, [req.params.id], (err, result) => {
    if (err) {
      console.log("aca estoy", err);
      res.status(400).json({ message: "Error al obtener los favoritos" });
    } else {
      res
        .status(200)
        .json({ message: "Favoritos encontrados", results: result });
    }
  });
});

router.get("/:id/:idMovie", (req, res) => {
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  console.log(req.params.id);
  console.log(req.params.idMovie);
  const idUser = req.params.id;
  const idMovie = req.params.idMovie;
  const sql = "SELECT * FROM usersfavorites Where idser=? AND idfavorite=?";
  conexion.query(sql, [idUser, idMovie], (err, result) => {
    if (err) {
      res.status(400).json({ message: "Error al verificar favorito" });
    } else {
      if (result.length === 1) {
        res.status(200).send({ message: "Favorito", active: true });
      } else {
        res.status(401).send({ message: "NoFavorito", active: false });
      }
    }
  });
});

router.post("/", (req, res) => {
  const idMovie = req.body.idMovie;
  const idUser = req.body.idUser;
  const path = req.body.backdrop_path;
  const title = req.body.name;
  const overview = req.body.overview;
  const vote = req.body.vote_average;
  const trailerUrl = req.body.trailerUrl;
  console.log(req.body);
  const sql1 = "SELECT * FROM moviesyseries WHERE idAPI=?";
  const sql2 = `INSERT INTO moviesyseries 
                (idAPI,backdrop_path,title,overview,vote_average,trailerUrl) 
                VALUES (?,?,?,?,?,?)`;
  const slq3 = `INSERT INTO usersfavorites (idser,idfavorite) VALUES (?,?)`;
  const sql4 = "SELECT * FROM usersfavorites WHERE idser=? AND idfavorite=?";

  conexion.query(sql1, [idMovie], (err, result1) => {
    if (err) {
      res.send("Error al insertar un favorito");
    } else {
      if (result1.length === 1) {
        conexion.query(sql4, [idUser, idMovie], (err, result2) => {
          if (err) {
            res
              .status(400)
              .json({ message: "Error al buscar en tabla users-favorites" });
          } else {
            console.log("---------------------");
            console.log(result2);
            console.log(result2.length);

            if (result2.length === 1) {
              res
                .status(200)
                .json({ message: "Este ya esta en tus favoritos" });
              console.log("lo agrege ");
            } else {
              conexion.query(slq3, [idUser, idMovie], (err, result) => {
                if (err) {
                  console.error(req.body);
                  res.status(400).json({
                    message: "Error al insertar en tabla users-favorites",
                  });
                } else {
                  res
                    .status(200)
                    .json({ message: "Favorito guardado correctamente" });
                }
              });
            }
          }
        });
      } else {
        conexion.query(
          sql2,
          [idMovie, path, title, overview, vote, trailerUrl],
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(400).json({
                message: "1 Error al insertar en tabla moviesyseries",
              });
            } else {
              conexion.query(slq3, [idUser, idMovie], (err, result) => {
                if (err) {
                  res.status(400).json({
                    message: "Error al insertar en tabla users-favorites",
                  });
                } else {
                  res
                    .status(200)
                    .json({ message: "Favorito guardado correctamente" });
                }
              });
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
