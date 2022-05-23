const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/Comment');
const authalpha = require ('../middleware/authalpha')
const authbeta = require ('../middleware/authbeta')

//routes de gestion des commentaires de publication :

//obtention des commentaires relatifs à un post spécifique
router.get('/:postId',authalpha, commentCtrl.getComment )
//création de commentaire
router.post('/', authalpha, commentCtrl.createComment);
//suppression d'un commentaire spécifique
router.delete('/', authbeta, commentCtrl.deleteComment)
//modification d'un commentaire spécifique
router.put('/', authbeta, commentCtrl.updateComment)

module.exports = router;