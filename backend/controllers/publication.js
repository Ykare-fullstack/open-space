
const express = require('express');   
const app = express();
const cors = require ('cors')
const fs = require('fs');
//librairie d'exception dans la recherche
const curatedLibrary = ['le','la','les','de','du','des','mon','ma','mes','et','ou','ton','ta','tes','son','sa','ses','un',"d'","l'","t'"]

var db = require('../utils/MySqlConnector')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

exports.createPublication = (req, res, next) =>{
    const description = req.body.description
    const category = req.body.category
    const userId =  req.auth.userId
    let multiValues = []
if(!description||description===''||description.length>500)
{
    res.status(400).send('une description est nécessaire pour chaque post')
}
else{
    db.query("INSERT INTO posts (description, category, iduser, creationdate) VALUES (?, ?, ?, NOW())", [ description, category, userId ], (err,result) => {
        if(err){
            console.log("erreur 1")
        }
        else{
            if (req.files.length === 0) {
                res.status(400).json({sent:true})     
            }
            else{
                for (const single_file of req.files) {      
                    pictureAdress = `${req.protocol}://${req.get('host')}/images/${single_file.filename}`
                    pictureData = [pictureAdress, userId, 0, result.insertId]
                    multiValues.push(pictureData)
                }
                db.query("INSERT INTO pictures (url, iduser, isprofile, idpost) VALUES ?", [multiValues], (error) => {
                    if(error){
                        console.log({error: error})
                    }
                    else{
                        res.status(400).json({sent:true})
                    }
                })    
            }
            
        }  
    }) 
}
      
}

exports.deletePublication = (req, res, next) =>{
    const postId = req.body.postId

    db.query("DELETE FROM posts WHERE idpost=?", postId, (err)=>{
        if(err){
            res.status(400).send(err)
        }
        else{
            db.query("DELETE FROM comments WHERE postid=?", postId, (err)=>{
                if(err){
                    res.status(400).send(err)
                }
                else{
                    db.query("DELETE FROM postappraisal WHERE idpost=?", postId, (err)=>{
                        if(err){
                            res.status(400).send(err)
                        }
                        else{
                            db.query("SELECT url FROM pictures WHERE idpost=?", postId, (err,result)=>{
                                if(err){
                                    res.status(400).send(err)
                                }
                                else{
                                    if(result.length == 0){
                                        res.status(200).send('publication supprimée')
                                    }
                                    else{

                                        result.forEach(picture => {
                                            fs.unlink(`images/${picture.url.split('/images/')[1]}`, (err => {
                                            if (err) console.log(err);
                                            }));
                                        });
                                        db.query("DELETE FROM pictures WHERE idpost=?", postId, (err)=>{
                                            if (err) {
                                                res.status(400).send("erreur de querry : DELETE post pictures");
                                            }
                                            else{
                                                console.log("photos post supprimées")
                                                res.status(200).send("post supprimé")
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.getAllPublicationFromUser= (req, res, next)=>{
    const userId = req.params.userId
    db.query('SELECT * FROM posts WHERE iduser=?', userId, (err, resultpost) =>{
        if(err){
            res.status(400).json({error})}
        else{
            if(resultpost.length===0){
                res.status(200)
            }
            else{
                let eta = resultpost.length
                for (let index = 0; index < resultpost.length; index++) {
                    db.query('SELECT * FROM pictures WHERE iduser=? AND idpost=? LIMIT 1',[userId,resultpost[index].idpost], (error, resultpicture)=>{
                        if(error){res.status(400).json({error})}
                        else{
                            if(resultpicture){
                                resultpost[index].picture=resultpicture
                            }
                            eta--
                            if(eta==0)
                            {       
                                res.status(200).json(resultpost)
                            }
                        }
                    })
                }
            }
        }
    })
}

exports.getPublication = (req, res, next)=>{

    const postId = req.params.postid
        
        db.query('SELECT * FROM posts WHERE idpost=?', postId, (error, resultpost) =>{
            if(error){
                res.status(400).json({error})}
            else{
                    
                if(!resultpost[0]){
                    res.status(200).send('erreur post inexistant !!')}
                else{
                    //on récupère les infos des photos liées au post
                    db.query('SELECT * FROM pictures WHERE idpost= ?', postId,(error, resultpicture)=>{
                        if(error){
                            res.status(400).json({error})
                        }
                        else{
                                
                            res.status(200).json({
                                idPost : resultpost[0].idpost,
                                description : resultpost[0].description,
                                category : resultpost[0].category,
                                idUser : resultpost[0].iduser,
                                pictures : resultpicture,

                            });
                        }
                    })
                }
            }
        })
}
          
exports.getNextPublication = (req, res, next) =>{
    
    //test de validité de la catégorie passé en paramètre
    const lastPostId = req.params.lastpostid
    const category = req.params.category
    if(category!= 'init' && category!= 'holidays' && category!= 'news' && category!= 'ideas' &&category!= 'diverse' &&category!= 'CE'){
            res.status(400).send('catégorie non existante')
    }
    else{

        if(lastPostId == 0){

            //initialisation du scrolling infini avec catégorie non spécifiée (1er affichage du site):
            if(category ==='init'){ //test de statut du selecteur CATEGORY
                //on récupère le dernier post publié
                db.query('SELECT * FROM posts  ORDER BY creationdate DESC', (error, resultpost) =>{
                    if(error){
                        res.status(400).json({error})}
                    else{
                        
                        if(!resultpost[0]){
                            res.status(200).json({keepGoing : false})}
                        else{
                            //on récupère les infos des photos liées au post
                            db.query('SELECT * FROM pictures WHERE idpost= ?', resultpost[0].idpost,(error, resultpicture)=>{
                                if(error){
                                    res.status(400).json({error})}
                                else{
                                    res.status(200).json({
                                        idPost : resultpost[0].idpost,
                                        description : resultpost[0].description,
                                        category : resultpost[0].category,
                                        idOwner : resultpost[0].iduser,
                                        pictures : resultpicture,
                                        keepGoing: true
                                    });   
                                }
                            })
                        }
                    }
                })
            }
            //dans le cas d'initialisation du scrolling mais la catégorie est renseignée :
            else{
                //on récupère le dernier post publié
                db.query('SELECT * FROM posts WHERE category=?  ORDER BY creationdate DESC',category, (error, resultpost) =>{
                    if(error){
                        res.status(400).json({error})}
                    else{

                        if(!resultpost[0]){
                            res.status(200).json({keepGoing : false})}
                        else{
                            //on récupère les infos des photos liées au post
                            db.query('SELECT * FROM pictures WHERE idpost=? ', resultpost[0].idpost,(error, resultpicture)=>{
                                if(error){
                                    res.status(400).json({error})}
                                else{  
                                    res.status(200).json({
                                        idPost : resultpost[0].idpost,
                                        description : resultpost[0].description,
                                        category : resultpost[0].category,
                                        idOwner : resultpost[0].iduser,
                                        pictures : resultpicture,
                                        keepGoing: true
                                    })
                                }
                            })
                        }
                    }
                })    
            }
        }
        else{
            //Cas post-initialisation: on va chercher le post suivant 
            if(category ==='init'){ //test de statut du selecteur CATEGORY
                //on récupère le dernier post publié avec une id inférieur au précédent post affiché
                db.query('SELECT * FROM posts WHERE idpost<?  ORDER BY creationdate DESC', lastPostId, (error, resultpost) =>{
                    if(error){
                        res.status(400).json({error})}
                    else{
                        if(!resultpost[0]){
                            res.status(200).json({keepGoing: false})}
                        else{
                            
                        //on récupère les infos des photos liées au post
                            db.query('SELECT * FROM pictures WHERE idpost= ?', resultpost[0].idpost,(error, resultpicture)=>{
                                if(error){
                                    res.status(400).json({error})}
                                else{       
                                    res.status(200).json({
                                        idPost : resultpost[0].idpost,
                                        description : resultpost[0].description,
                                        category : resultpost[0].category,
                                        idOwner : resultpost[0].iduser,
                                        pictures : resultpicture,
                                        keepGoing: true
                                    });
                                }
                            })
                        }
                    }
                })
            }
            else{
                //on récupère le dernier post publié avec une id inférieur au précédent post affiché
                db.query('SELECT * FROM posts WHERE idpost<? AND category=?  ORDER BY creationdate DESC', [lastPostId, category], (error, resultpost) =>{
                    if(error){
                        res.status(400).json({error})}
                    else{
                        if(!resultpost[0]){
                            res.status(200).json({keepGoing: false})}
                        else{
                            //on récupère les infos des photos liées au post
                            db.query('SELECT * FROM pictures WHERE idpost= ?', resultpost[0].idpost,(error, resultpicture)=>{
                                if(error){
                                    res.status(400).json({error})}
                                else{
                                        
                                    res.status(200).json({
                                        idPost : resultpost[0].idpost,
                                        description : resultpost[0].description,
                                        category : resultpost[0].category,
                                        idOwner : resultpost[0].iduser,
                                        pictures : resultpicture,
                                        keepGoing:true
                                    });
                                }
                            })
                        }
                    }
                })    
            }
        }
    }
}

exports.updatePublication = (req, res, next) =>{
    const userId = req.body.userId
    const postId = req.body.postId
    const description = req.body.description
    const picturesInfo = JSON.parse(req.body.remainingpictures)
    console.log(picturesInfo)
    if(!description||description===''||description.length>500||!userId||userId==='')
    {
        res.status(400).send('une description est nécessaire pour chaque post')
    }
    else
    {
        let multiValues = []
        db.query("UPDATE posts SET description = ? WHERE idpost=?",[description, postId],(err)=>{
            if(err){
                res.status(400).send(err)}
            else{
                if(picturesInfo.length === 0){
                    db.query("SELECT url FROM pictures WHERE idpost=?", postId, (err,result)=>{
                        if(err){
                            res.status(400).send(err)
                        }
                        else{
                            if(result.length == 0){
                                console.log('pas de photos à supprimer')
                                if (req.files.length !== 0) {
                                    for (const single_file of req.files) {
                                
                                    pictureAdress = `${req.protocol}://${req.get('host')}/images/${single_file.filename}`
                                    pictureData = [pictureAdress, userId, 0, postId]
                                    multiValues.push(pictureData)
                                    }
                                    db.query("INSERT INTO pictures (url, iduser, isprofile, idpost) VALUES ?", [multiValues], (err) => {
                                        if(err){
                                            console.log({error: err})
                                        }
                                        else{
                                            res.status(200).send('post modifié')
                                        }
                                    }) 
                                }
                                else {
                                    res.status(200).send('post modifié')
                                }
                            }
                            else{
                                console.log('il y a des photos a supprimer')
                                result.forEach(picture => {
                                    console.log(`images/${picture.url.split('/images/')[1]}`)
                                    fs.unlink(`images/${picture.url.split('/images/')[1]}`, (err => {
                                    if (err) console.log(err);
                                    }));
                                });
                                db.query("DELETE FROM pictures WHERE idpost=? ",postId, (err)=>{
                                    if(err){
                                        res.status(400).send(err)
                                    }
                                    else{
                                        if (req.files.length !== 0) {
                                            for (const single_file of req.files) {
                                        
                                            pictureAdress = `${req.protocol}://${req.get('host')}/images/${single_file.filename}`
                                            pictureData = [pictureAdress, userId, 0, postId]
                                            multiValues.push(pictureData)
                                            }
                                            db.query("INSERT INTO pictures (url, iduser, isprofile, idpost) VALUES ?", [multiValues], (err) => {
                                                if(err){
                                                    console.log({error: err})
                                                }
                                                else{
                                                    res.status(200).send('post modifié')
                                                }
                                            }) 
                                        }
                                        else {
                                            res.status(200).send('post modifié')
                                        }
                                    }    
                                })  
                            }      
                        }
                    })
                }
                else{
                    db.query("SELECT url FROM pictures WHERE idpost=? AND id NOT IN (?)", [postId,picturesInfo], (err,result)=>{
                        if(err){
                            res.status(400).send(err)
                        }
                        else{
                            if(result.length == 0){
                                if (req.files.length !== 0) {
                                    for (const single_file of req.files) {
                                
                                    pictureAdress = `${req.protocol}://${req.get('host')}/images/${single_file.filename}`
                                    pictureData = [pictureAdress, userId, 0, postId]
                                    multiValues.push(pictureData)
                                    }
                                    db.query("INSERT INTO pictures (url, iduser, isprofile, idpost) VALUES ?", [multiValues], (err) => {
                                        if(err){
                                            console.log({error: err})
                                        }
                                        else{
                                            res.status(200).send('post modifié')
                                        }
                                    }) 
                                }
                                else {
                                    res.status(200).send('post modifié')
                                }
                            }
                            else{
                                result.forEach(picture => {
                                    fs.unlink(`images/${picture.url.split('/images/')[1]}`, (err => {
                                    if (err) console.log(err);
                                    }));
                                });
                                db.query("DELETE FROM pictures WHERE idpost=? AND id NOT IN (?)", [postId,picturesInfo], (err,result)=>{
                                    if(err){
                                        res.status(400).send(err)
                                    }
                                    else{
                                        if (req.files.length !== 0) {
                                            for (const single_file of req.files) {
                                        
                                                pictureAdress = `${req.protocol}://${req.get('host')}/images/${single_file.filename}`
                                                pictureData = [pictureAdress, userId, 0, postId]
                                                multiValues.push(pictureData)
                                            }
                                            db.query("INSERT INTO pictures (url, iduser, isprofile, idpost) VALUES ?", [multiValues], (error) => {
                                                if(err){
                                                    res.status(400).send(err)
                                                }
                                                else{
                                                    res.status(200).send('post modifié')
                                                }
                                            }) 
                                        }
                                        else {
                                            res.status(200).send('post modifié')
                                        }
                                    }
                                })  
                            }  
                        }
                    }) 
                }
            }
        })
    }
    
}

exports.searchPublication = (req, res, next) =>{
    console.log(req.params.postsearch)
    if(!req.params.postsearch||req.params.postsearch.length>300)
    {
        res.status(200).send('paramètres de recherches invalides')
    }
    else
    {
        const searchstring = req.params.postsearch.split('&')
        let resultBuffer = []
        for (let i = 0; i < searchstring.length; i++) {
            if(!curatedLibrary.includes(searchstring[i]))
            searchstring[i]=`%${searchstring[i]}%`    
        
            else{
                searchstring.splice(i,1)
            }             
        }
        let eta1 = searchstring.length
        for (let j = 0; j < searchstring.length; j++) {

            db.query('SELECT * FROM posts WHERE description LIKE ?', searchstring[j], (err, resultpost) =>{
                if(err){
                    res.status(400).json({err})}
                else{
                    if(resultpost.length!=0){
                        for (let k = 0; k < resultpost.length; k++) {
                            resultBuffer.push(resultpost[k])
                        }
                    }
                    eta1--
                }
                if(eta1===0){
                    if(resultBuffer.length===0){
                        res.status(200)
                    }
                    else{
                        let eta2 = resultBuffer.length
                        for (let index = 0; index < resultBuffer.length; index++) {
                            idpost = resultBuffer[index].idpost
                            db.query('SELECT * FROM pictures WHERE idpost=? LIMIT 1',resultBuffer[index].idpost, (error, resultpicture)=>{
                                if(error){res.status(400).json({error})}
                                else{
                                    if(resultpicture){ 
                                        resultBuffer[index].picture=resultpicture
                                    }
                                    eta2--
                                    if(eta2==0)
                                    {      
    
                                        res.status(200).json(resultBuffer)
                                    }
                                }
                            })
                        }
                    }
                }
            })       
        }
    }
    
}
