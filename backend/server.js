// Módulos
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
// middlewares

// config
const app = express();
const dbName = "partytime";
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// rotas no express
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
// conexao mongoDB
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://127.0.0.1/${dbName}`, {
  useNewURLParser: true,
  useUnifiedTopology: true,
});



app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
