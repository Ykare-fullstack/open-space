const cors = require('cors');

const express = require('express');   
const app = express();
var db = require('../utils/MySqlConnector')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

//module d'insertion l'état connecté de l'utilisateur
exports.checkin = (req,res,next) =>{
    const iduser = req.auth.userId
    if(isNaN(iduser)||!iduser||iduser===0||iduser.length>6)
    {
        res.status(400).send("erreur d'iduser")
    }
    else
    {
        db.query('DELETE FROM checkedin WHERE iduser=?', iduser, (err)=>{
            if(err){
                console.log('erreur de suppression checkin')}
            else{
                db.query('INSERT INTO checkedin (iduser,checkedintime) VALUES (?,NOW())', iduser, (err)=>{
                    if(err)
                        res.status(400).send("erreur d'insertion checkin")
                    else
                        res.status(200).send({authenticated: true})
                })
            }
        })
    }
    
    
}
//module de vérification pour persistance de connexion
exports.ischeckedin = (req,res,next) =>{
    
    const userId = req.auth.userId
    if(isNaN(userId)||!userId||userId===0||userId.length>6)
    {
        res.status(400).send("erreur d'iduser")
    }
    else
    {
        db.query('SELECT * FROM checkedin WHERE iduser=? AND checkedintime >= NOW() - INTERVAL 1 DAY', userId, (err,result)=>{
            if(err)
                res.status(400).send('erreur de querry')
            else{
                if(result.length == 0){
                    res.status(403).send({authenticated: false})
                }
                else{
                    res.status(200).send({authenticated: true})
                }
            }    
        })  
    }
     
}
//logout
exports.checkout = (req,res,next) =>{
    const iduser = req.auth.userId
    if(isNaN(iduser)||!iduser||iduser===0||iduser.length>6)
    {
        res.status(400).send("erreur d'iduser")
    }
    else
    {
        db.query('DELETE FROM checkedin WHERE iduser=?',iduser, (err) =>{
            if(err)res.status(400).send('erreur de querry')
            else res.status(200).send('checked out')
        })
    }
    
}