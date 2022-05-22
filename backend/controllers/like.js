
const express = require('express');   
const app = express();
const cors = require ('cors')
var db= require('../utils/MySqlConnector')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

exports.getAppraisal = (req, res, next) =>{
    const postId = req.params.postId
    const userId = req.auth.userId
    let userBuffer = -1
    
    db.query("SELECT COUNT(*) AS count FROM postappraisal WHERE idpost=? && appraisal=1", postId, (error, resultlike)=>{
        if(error){
            console.log({error: error})
        }
        else{
            db.query("SELECT COUNT(*) AS count FROM postappraisal WHERE idpost=? && appraisal=0", postId, (error, resultdislike)=>{
                if(error){
                    console.log({error: error})
                }
                else{
                    db.query("SELECT appraisal FROM postappraisal WHERE idpost=? && iduser=?", [postId,userId], (error, resultuser)=>{
                        if(error){
                            console.log({error: error})
                        }
                        else{
                            if(resultuser.length!=0){
                                userBuffer=resultuser[0].appraisal
                            }
                            res.status(200).send({
                                likes:resultlike[0].count,
                                dislikes:resultdislike[0].count,
                                userappraisal:userBuffer})
                        }
                    })
                }
            })   
        }
    })    
}

exports.postAppraisal = (req, res, next)  =>{
    const postId = req.body.postId
    const userId = req.body.userId
    const appraisal = req.body.appraisal
    if(appraisal!==1 && appraisal!==0 && appraisal!==-1)
    {
        res.status(400).send("valeur d'évaluation de la publacation erronée",{like:1,dislike:0,neutre:-1})
    }
    else
    {
        if(appraisal===-1){
            db.query("DELETE FROM postappraisal WHERE iduser=? AND idpost=?",[userId, postId],(err)=>{
                if(err){
                    console.log({error: err})
                }
                else{
                    res.status(200).send('appraisal registered')
                } 
            })
        }
        else{
            db.query("INSERT INTO postappraisal (idpost,iduser,appraisal) VALUE (?,?,?)",[postId, userId,appraisal],(err)=>{
                if(err){
                    console.log({error: err})
                }
                else{
                    res.status(200).send('appraisal registered')
                }
            })
        }
    } 
}