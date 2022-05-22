const express = require('express');
const router = express.Router();
const roleCtrl = require('../controllers/role');
const authgamma = require ('../middleware/authgamma')

//modification du role utilisateur
router.put('/', authgamma, roleCtrl.switchR)

module.exports = router;