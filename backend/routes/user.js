const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config')
const authalpha = require ('../middleware/authalpha')
const authbeta = require ('../middleware/authbeta')
const authgamma = require ('../middleware/authgamma')


router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.post('/check', authgamma, userCtrl.checkUserPass)

router.get('/gu1/:userId', authalpha, userCtrl.getUserInfo)
router.get('/gu2/:usersearch', authalpha, userCtrl.researchUser)
router.get('/gu3',authalpha, userCtrl.getViewerInfo)

router.delete('/', authgamma, userCtrl.deleteUser)

router.put('/picture/:id', authbeta, multer, userCtrl.updateUserPicture)
router.put('/bio', authbeta, userCtrl.updateUserDescription)
router.put('/pass', authgamma,userCtrl.updateUserPass)

module.exports = router;