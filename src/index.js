const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/users_routes");
const authRoutes = require("./routes/auth_routes");
const favoritesRoutes = require("./routes/favorites_routes");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.static("public"));

app.use(express.json());

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/favorites", favoritesRoutes);

app.listen(8000, () => {
  console.log("Servidor iniciado");
});
