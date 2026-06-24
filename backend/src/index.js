const express = require("express");
const cors = require("cors");
const turnosRouter = require("./routes/turnos");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// es la ruta para probar
app.get("/", (req, res) => {
  res.send("API de turnos de barbería funcionando 💈");
});

// es la ruta e turnos
app.use("/turnos", turnosRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});