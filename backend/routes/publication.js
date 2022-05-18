const express = require('express');
const router = express.Router();
const publicationCtrl = require('../controllers/publication');
const authalpha = require('../middleware/authalpha');
const authbeta = require('../middleware/authbeta');
const multer = require('../middleware/multer-config')

router.get('/gp1/:postsearch', authalpha, publicationCtrl.searchPublication)
router.get('/gp2/:userId', authalpha, publicationCtrl.getAllPublicationFromUser)
router.get('/gp3/:category/:lastpostid',authalpha, publicationCtrl.getNextPublication )
router.get('/gp4/:postid',authalpha, publicationCtrl.getPublication )


router.put('/:id', authbeta, multer, publicationCtrl.updatePublication)

router.post('/:id', authalpha, multer, publicationCtrl.createPublication);

router.delete('/', authbeta, publicationCtrl.deletePublication)

module.exports = router;