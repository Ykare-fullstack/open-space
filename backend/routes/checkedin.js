const express = require('express');
const router = express.Router();
const checkedinCtrl = require('../controllers/checkedin');
const authalpha = require ('../middleware/authalpha')

router.post('/', authalpha, checkedinCtrl.checkin);
router.get('/', authalpha, checkedinCtrl.ischeckedin);
router.delete('/', authalpha, checkedinCtrl.checkout)

module.exports = router;