const express = require("express");

const usersRoutes = require("./routes/users_routes");

const app = express();

app.use(express.json());

app.use("/users", usersRoutes);

app.listen(8000, () => {
  console.log("Servidor iniciado");
});
