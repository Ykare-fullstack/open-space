const express = require('express');
const router = express.Router();
const checkedinCtrl = require('../controllers/checkedin');
const authalpha = require ('../middleware/authalpha')

//routes de gestion de la persistance de connexion utilisateur (persistance au refresh):
//check le client comme connecté (daté)
//vérifie si l'utilisateur est dans la liste des connectés depuis un jour (via ID)
//déconnecte un utilisateur forçant le login pour reconnexion
router.post('/', authalpha, checkedinCtrl.checkin);
router.get('/', authalpha, checkedinCtrl.ischeckedin);
router.delete('/', authalpha, checkedinCtrl.checkout)

module.exports = router;