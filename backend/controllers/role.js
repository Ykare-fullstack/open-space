
const express = require('express');   
const app = express();
const cors = require ('cors')
var db = require('../utils/MySqlConnector')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

//modification du role utilisateur
exports.switchR= (req, res, next) =>{
    const newrole = req.body.func
    const promoted = req.body.promoted

    db.query('UPDATE role SET role = ? WHERE iduser =?',[newrole,promoted], (err) =>{
        if(err){
            res.status(400).send({err})
        }
        else{
            res.status(200).send('utilisateur modifié')
        }
    })
}