const cors = require('cors');
const mysql = require('mysql');
const express = require('express');   
const app = express();
var db = require('../utils/MySqlConnector')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

exports.checkin = (req,res,next) =>{
    const iduser = req.auth.userId
    db.query('DELETE FROM checkedin WHERE iduser=?', iduser, (err)=>{
        if(err){
            console.log('erreur insertion SQL')}
        else{
            db.query('INSERT INTO checkedin (iduser,checkedintime) VALUES (?,NOW())', iduser, (err)=>{
                if(err)
                    res.status(400).send('erreur de  DELETE querry')
                else
                    res.status(200).send({authenticated: true})
            })
        }
    })
    
}
exports.ischeckedin = (req,res,next) =>{
    
    const userId = req.auth.userId
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
exports.checkout = (req,res,next) =>{
    const iduser = req.auth.userId
    db.query('DELETE FROM checkedin WHERE iduser=?',iduser, (err) =>{
        if(err)res.status(400).send('erreur de querry')
        else res.status(200).send('checked out')
    })
}