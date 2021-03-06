const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/Like');
const authalpha = require ('../middleware/authalpha')

//routes d'évaluation de publication:
//obtention de l'évaluation d'une publication spécifique
router.get('/:postId',authalpha, likeCtrl.getAppraisal )
//envoi d'une évaluation
router.post('/', authalpha, likeCtrl.postAppraisal);

module.exports = router;