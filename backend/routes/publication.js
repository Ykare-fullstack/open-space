const express = require('express');
const router = express.Router();
const publicationCtrl = require('../controllers/publication');
const authalpha = require('../middleware/authalpha');
const authbeta = require('../middleware/authbeta');
const multer = require('../middleware/multer-config')

//routes d'obtention d'information de publication :
//recherche de publications
//publications d'un utilisateur spécifique
//obtention de la publication suivante dans la liste (scroll infini)
//Obtention d'une publication unique via ID
router.get('/gp1/:postsearch', authalpha, publicationCtrl.searchPublication)
router.get('/gp2/:userId', authalpha, publicationCtrl.getAllPublicationFromUser)
router.get('/gp3/:category/:lastpostid',authalpha, publicationCtrl.getNextPublication )
router.get('/gp4/:postid',authalpha, publicationCtrl.getPublication )

//route de modification de publication
router.put('/:id', authbeta, multer, publicationCtrl.updatePublication)

//route de création de publication
router.post('/:id', authalpha, multer, publicationCtrl.createPublication);

//route de suppression de publication
router.delete('/', authbeta, publicationCtrl.deletePublication)

module.exports = router;