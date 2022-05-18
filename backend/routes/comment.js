const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/Comment');
const authalpha = require ('../middleware/authalpha')
const authbeta = require ('../middleware/authbeta')

router.get('/:postId',authalpha, commentCtrl.getComment )
router.post('/', authalpha, commentCtrl.createComment);
router.delete('/', authbeta, commentCtrl.deleteComment)
router.put('/', authbeta, commentCtrl.updateComment)

module.exports = router;