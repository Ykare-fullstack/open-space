const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config')
const authalpha = require ('../middleware/authalpha')
const authbeta = require ('../middleware/authbeta')
const authgamma = require ('../middleware/authgamma')

//routes d'identification utilisateur 
//inscription   
//identification
//vérification de mot de passe (requiert autorisation maximale)
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.post('/check', authgamma, userCtrl.checkUserPass)

//routes d'import d'information utilisateur
//affichage des vignettes utilisateurs sur post et commentaires, nécessaire pour OnePagePost
//recherche d'utilisateurs 
//affichage des informations du compte utilisateur
router.get('/gu1/:userId', authalpha, userCtrl.getUserInfo)
router.get('/gu2/:usersearch?', authalpha, userCtrl.researchUser)
router.get('/gu3',authalpha, userCtrl.getViewerInfo)

//route de suppression de compte utilisateur et toutes autres ressources associées
//(requiert autorisation maximale)
router.delete('/', authgamma, userCtrl.deleteUser)

//routes de mise à jour d'utilisateur
//photo de profil
//description/bio
//mot de passe (requiert autorisation maximale)
router.put('/picture/:id', authbeta, multer, userCtrl.updateUserPicture)
router.put('/bio', authbeta, userCtrl.updateUserDescription)
router.put('/pass', authgamma,userCtrl.updateUserPass)

module.exports = router;