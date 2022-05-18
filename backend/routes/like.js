const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/Like');
const authalpha = require ('../middleware/authalpha')


router.get('/:postId',authalpha, likeCtrl.getAppraisal )
router.post('/', authalpha, likeCtrl.postAppraisal);

module.exports = router;