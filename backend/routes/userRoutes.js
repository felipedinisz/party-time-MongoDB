const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

//Middleware
const verifyToken = require("../helpers/check-token");

// helper
const getUserByToken = require("../helpers/getUserByToken");

// obter um usuário
router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  // Verificar usuário
  try {
    const user = await User.findOne({ _id: id }, { password: 0 });
    res.json({ error: null, user });
  } catch (err) {
    return res.status(400).json({ error: "O usuário não existe!" });
  }
});

// Atualizar um usuário
router.put("/", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const user = await getUserByToken(token);
  const userReqId = req.body.id;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  const userId = user._id.toString();

  // Checa se o id de usuário é igual ao id do token
  if (userId != userReqId) res.status(401).json({ error: "Acesso negado!" });

  // cria um objeto de usuario
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Checa se as senhas batem
  if (password !== confirmpassword)
    return res.status(400).json({ error: "As senhas precisam ser iguais!" });

  if (password == confirmpassword && password != null) {
    const salt = await bcrypt.genSalt(12);
    let reqPassword = req.body.password;
    const passwordHash = await bcrypt.hash(reqPassword, salt);
    reqPassword = passwordHash;
    // updating data
    updateData.password = passwordHash;
  }

  try {
    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true }
    );
    res.json({
      error: null,
      msg: "Usuário atualizado com sucesso",
      data: updateUser,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
