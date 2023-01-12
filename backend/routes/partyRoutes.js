const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Party = require("../models/party");
const User = require("../models/user");

// Definir o armazenamento de arquivos
const diskStorage = require("../helpers/file-storage");
const upload = multer({ storage: diskStorage });

// middleware
const verifyToken = require("../helpers/check-token");
// helper
const getUserByToken = require("../helpers/getUserByToken");

// criar nova festa
router.post(
  "/",
  verifyToken,
  upload.fields([{ name: "photos" }]),
  async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.party_date;

    let files = [];

    if (req.files) files = req.files.photos;

    if (title == null || description == null || partyDate == null)
      return res
        .status(400)
        .json({ error: "Preencha pelo menos nome, descrição e data." });

    //verifica usuário
    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);
    const userId = userByToken._id.toString();

    try {
      const user = await User.findOne({ _id: userId });

      // cria o array de fotoscom o caminho de imagem
      let photos = [];

      if (files && files.length > 0) {
        files.forEach((photo, i) => {
          photos[i] = photo.path;
        });
      }

      const party = new Party({
        title: title,
        description: description,
        partyDate: partyDate,
        photos: photos,
        privacy: req.body.privacy,
        userId: user._id.toString(),
      });

      try {
        const newParty = await party.save();
        res.json({
          error: null,
          msg: "Evento criado com sucesso",
          data: newParty,
        });
      } catch (err) {
        return res.status(400).json({ error });
      }
    } catch (err) {
      return res.status(400).json({ error: "Acesso negado." });
    }
  }
);

// pega todas as festas públicas
router.get("/all", async (req, res) => {
  try {
    const parties = await Party.find({ privacy: false }).sort([["_id", -1]]);
    res.json({ error: null, parties: parties });
  } catch (err) {
    return res.status(400).json({ error });
  }
});

// pega todas as festas do usuário
router.get("/userparties", verifyToken, async (req, res) => {
  try {
    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userId = user._id.toString();

    const parties = await Party.find({ userId: userId });
    res.json({ error: null, parties: parties });
  } catch (err) {
    return res.status(400).json({ error });
  }
});

router.get("/userparty/:id", verifyToken, async (req, res) => {
  try {
    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userId = user._id.toString();
    const partyId = req.params.id;

    const party = await Party.findOne({ _id: partyId, userId: userId });

    res.json({ error: null, party: party });
  } catch (err) {
    return res.status(400).json({ error });
  }
});

// pega festas públicas ou privadas
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const party = await Party.findOne({ _id: id });

    if (party.privacy === false) res.json({ error: null, party: party });
    else {
      const token = req.header("auth-token");
      const user = await getUserByToken(token);
      const userId = user._id.toString();
      const userPartyId = party.userId.toString();

      //checa se a festa é do usuário
      if (userId == userPartyId) res.json({ error: null, party: party });
    }

  } catch (err) {
    return res.status(400).json({ error: "Este evento não existe!" });
  }
});

module.exports = router;
