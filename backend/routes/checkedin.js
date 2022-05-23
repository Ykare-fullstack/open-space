const express = require('express');
const router = express.Router();
const checkedinCtrl = require('../controllers/checkedin');
const authalpha = require ('../middleware/authalpha')

//routes de gestion de la persistance de connexion utilisateur (persistance au refresh):

//check le client comme connecté (daté)
router.post('/', authalpha, checkedinCtrl.checkin);
//vérifie si l'utilisateur est dans la liste des connectés depuis un jour (via ID)
router.get('/', authalpha, checkedinCtrl.ischeckedin);
//déconnecte un utilisateur forçant le login pour reconnexion
router.delete('/', authalpha, checkedinCtrl.checkout)

module.exports = router;