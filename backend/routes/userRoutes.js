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
router.patch("/", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const user = await getUserByToken(token);

  const { id: userReqId, password, confirmPassword} = req.body;

  const userId = user._id.toString();

  // check if user id is equal token user id
  if (userId != userReqId) {
    return res.status(401).json({ error: "Acesso negado!" });
  }

  // cria objeto de usuário
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };


  if (password != confirmPassword) {
    return res.status(401).json({ error: "As senhas não conferem." });
    // troca senha
  } else if (password == confirmPassword && password != null) {
    // cria senha
    const salt = await bcrypt.genSalt(12);
    const reqPassword = req.body.password;

    const passwordHash = await bcrypt.hash(reqPassword, salt);

    req.body.password = passwordHash;

    // atualiza data
    updateData.password = passwordHash;
  }

  try {
    // retorna data atualizada
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true }
    );
    res.json({
      error: null,
      msg: "Usuário atualizado com sucesso!",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
