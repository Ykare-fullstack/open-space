
const express = require('express');   
const app = express();
const cors = require ('cors')
var db = require('../utils/MySqlConnector')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

exports.getComment = (req, res, next) =>{
    const postId = req.params.postId
    db.query("SELECT * FROM comments WHERE postId=? ORDER BY creationdate", postId, (err, result) =>{
        if(err)
            res.status(400).send('getComment query error')
        else
            res.status(200).send(result)
    })
}

exports.createComment = (req, res, next) =>{
    const postId = req.body.postId
    const content = req.body.content
    const userId = req.body.userId
    if(!content||content===''||!postId||!userId||content.length()>400)
    {
        res.status(400).send('un commentaire ne peut pas avoir de contenu textuel vide')
    }
    else{
        db.query("INSERT INTO comments (creationdate,content, postid, iduser) VALUES (NOW(),?,?,?)",[content, postId, userId] , (err) =>{
            if(err)
                res.status(400).send(err)
            else
                res.status(200).send('commentaire crée')
        })
    }
}

exports.deleteComment = (req, res, next) =>{
    const commentId = req.body.commentId
    db.query("DELETE FROM comments WHERE idcomment=?", commentId , (err) =>{
        if(err)
            res.status(400).send('erreur de querry de suppresion de commentaire')
        else
            res.status(200).send('comment deleted')
    })
}

exports.updateComment =(req, res, next)=>{
    const commentId = req.body.commentId
    const content = req.body.content
    if(!content||content===''||content.length()>400)
    {
        res.status(400).send('contenu du commentaire non conforme')
    }
    else{
        db.query("UPDATE comments SET content = ? WHERE idcomment=?", [content, commentId], (err)=>{
            if(err)
                res.status(400).send('erreur de mise à jour de commentaire')
            else
                res.status(200).send('comment updated')
        })
    }   
}