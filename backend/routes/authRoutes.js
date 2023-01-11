const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// Registrar um usuário
router.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  // Checa se os campos estão preenchidos
  if (
    name == null ||
    email == null ||
    password == null ||
    confirmpassword == null
  ) {
    return res
      .status(400)
      .json({ error: "Por favor, preencha todos os campos!" });
  }

  // Checa se as senhas conferem
  if (password !== confirmpassword) {
    return res.status(400).json({ error: "As senhas precisam ser iguais!" });
  }

  // Checa se o usuário existe
  const emailExists = await User.findOne({ email: email });

  if (emailExists)
    return res.status(400).json({ error: "Email já cadastrado no sistema!" });

  // Cria senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log(passwordHash);

  const user = new User({
    name: name,
    email: email,
    password: passwordHash,
  });

  try {
    const newUser = await user.save();

    // criar token
    const token = jwt.sign(
      // payload
      {
        name: newUser.name,
        id: newUser._id,
      },
      "nossosecret"
    );
    // return token
    res.json({
      error: null,
      msg: "Você realizou o cadastro com sucesso",
      token: token,
      userId: newUser._id,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
