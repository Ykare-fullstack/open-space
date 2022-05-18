const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const express = require('express');   
const app = express();
const fs = require('fs');
var db = require('../utils/MySqlConnector')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

//-----------------------------------------------------------------------------------
exports.signup = (req, res, next)=> {

 
  const userEmail = req.body.email
  const userFirstname = req.body.firstname
  const userLastname = req.body.lastname
  const blankPicture= `${req.protocol}://${req.get('host')}/images/blank-profile-picture.png`

  bcrypt.hash(req.body.password, 10)
        .then(hash => {
          
          db.query("INSERT INTO users (password, email, firstname, lastname, profilepicture) VALUES (?,?,?,?,?)", [hash, userEmail, userFirstname, userLastname, blankPicture ], (err) => {
            if(err)
            {
              res.status(400).send({created:false});
            }
            else{
              db.query("SELECT idusers FROM users ORDER BY idusers DESC LIMIT 1", (error, result) => {
                if(error)
                {
                  console.log(error);
                }
                else{
                  db.query("INSERT INTO role (iduser,role) VALUES (?,1)", result[0].idusers, (err) => {
                    if(err){
                      console.log(err)
                      
                    }
                    else{
                      res.status(200).json({created :true})
                    }
                  })
                }
              })
            }
          })   
  })
};

//-----------------------------------------------------------------------------------
exports.login = (req, res, next) => {

  const userEmail =req.body.email
  const userPassword = req.body.password


  db.query("SELECT * FROM users WHERE email= ?", userEmail, (err, result) =>{

    if(err)
    {
      console.log('ERREUR DE QUERRY')
      res.status(401).send({ access: false });
    }
    else
    { 
      if(result[0])
      {
      console.log('RESULTAT OBTENU DANS LA BDD') 
        bcrypt.compare(userPassword, result[0].password)
          .then(valid => {
            if (!valid) {
              res.status(401).send({ access: false });
            }
            else{
              const iduser = result[0].idusers.toString()

              db.query("SELECT * FROM role WHERE iduser=?", iduser, (err, resultrole) =>{
                if(err)
                {
                  console.log('ERREUR DE QUERRY')
                  res.status(401).send({ access: false });
                }
                else{
                  res.status(200).send({
                    access: true,
                    userId: iduser,
                    role: resultrole[0].role,
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    description: result[0].description,
                    profilepicture: result[0].profilepicture,
                    token: jwt.sign({ userId: result[0].idusers,
                    role: resultrole[0].role },'RANDOM_TOKEN_SECRET',{ expiresIn: '24h' })
                  })
                }
              })  
            }
          })
      }
      else
      {
        res.status(400).send({ access: false });
      }
    }
  })
}

//-----------------------------------------------------------------------------------
exports.getUserInfo = (req, res, next) => {
  const userId =  req.params.userId

  db.query("SELECT * FROM users WHERE idusers = ?", userId, (err, result) =>{
  
    if(err)
    {
      console.log(err.message)
      res.status(401).send({ message: 'erreur de querry' });
    }
    else 
    {
      if(!result)
      {
        console.log('AUCUN RESULTAT CORRESPONDANT POUR CET ID')
        res.status(401).send({ message: 'AUCUN RESULTAT CORRESPONDANT POUR CET ID' });
      }
      else
      { 
        db.query("SELECT * FROM role WHERE iduser=?", userId, (err, resultrole) =>{
          if(err)
          {
            console.log('ERREUR DE QUERRY')
            res.status(401).send({ message: 'erreur de querry' });
          }
          else{
              res.status(200).send({
                userId: userId,
                role : resultrole[0].role,
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                description: result[0].description,
                profilepicture: result[0].profilepicture})
          }
        })
      }
    }
  })
}
//-----------------------------------------------------------------------------------
exports.getViewerInfo = (req, res, next) => {
  const userId =  req.auth.userId
  
  db.query("SELECT * FROM users WHERE idusers = ?", userId, (err, result) =>{
  
    if(err)
    {
      console.log(err.message)
      res.status(401).send({ message: 'erreur de querry' });
    }
    else 
    {
      if(!result)
      {
        console.log('AUCUN RESULTAT CORRESPONDANT POUR CET ID')
        res.status(401).send({ message: 'AUCUN RESULTAT CORRESPONDANT POUR CET ID' });
      }
      else
      { 
        db.query("SELECT * FROM role WHERE iduser=?", userId, (err, resultrole) =>{
          if(err)
          {
            console.log('ERREUR DE QUERRY')
            res.status(401).send({ message: 'erreur de querry' });
          }
          else{
            res.status(200).send({
              userId: userId,
              role: resultrole[0].role,
              lastname: result[0].lastname,
              firstname: result[0].firstname,
              description: result[0].description,
              profilepicture: result[0].profilepicture})
        }
      })
      }
    }
  })
}

//-----------------------------------------------------------------------------------
exports.updateUserPass = (req, res, next) => {
  const userId =  req.auth.userId
  const pass = req.body.pass
  bcrypt.hash(pass, 10)
  .then((hash) => {
    if(!pass){
      res.status('401').send('erreur : pass non envoyé vers api')
    }
    else{
      db.query('UPDATE users SET password=? WHERE idusers=?', [hash, userId], (err) =>{
        if (err) {
          res.status('401').send(err.message);
        }
        else{
          res.status('200').send("password de l'utilisateur mise à jour")
        }
      })
      
    }
  })
}

//-----------------------------------------------------------------------------------
exports.checkUserPass = (req, res, next) => {
  const userId =req.body.userId
  const userPassword = req.body.pass
  db.query("SELECT * FROM users WHERE idusers= ?", userId, (err, result) =>{

    if(err)
    {
      console.log('ERREUR DE QUERRY')
      res.status(401).send({ message: 'erreur de querry' });
    }
    else
    { 
      if(result[0])
      { 
        bcrypt.compare(userPassword, result[0].password)
          .then(valid => {
            if (!valid) {
              res.status(200).json({check:false  
              });
            }
            else{

              res.status(200).json({check:true});
            }
          })
      }
      else
      {
        res.status(200).json({check:false  
        });
      }
    }
  })
}

//-----------------------------------------------------------------------------------
exports.deleteUser = (req, res, next) => {
  const userId =  req.auth.userId
  
  db.query("DELETE FROM users WHERE idusers=?", userId, (err)=>{
    if (err) {
      res.status(400).send("erreur de querry");
    }
    else{
      db.query("DELETE FROM posts WHERE iduser=?", userId, (err)=>{
        if (err) {
          res.status(400).send("erreur de querry : DELETE user post");
        }
        else{
          db.query("DELETE FROM postappraisal WHERE iduser=?", userId, (err)=>{
            if (err) {
              res.status(400).send("erreur de querry : DELETE user appraisal");
            }
            else{
              db.query('DELETE FROM comments WHERE iduser=?', userId, (err)=>{
                if (err) {
                  res.status(400).send("erreur de querry : DELETE user comments");
                }
                else{
                  db.query('DELETE FROM checkedin WHERE iduser=?', userId, (err)=>{
                    if (err) {
                      res.status(400).send("erreur de querry : DELETE user checkedin status");
                    }
                    else{
                      db.query("SELECT url FROM pictures WHERE iduser=?", userId, (err, result)=>{
                        if (err) {
                          res.status(400).send("erreur de querry : SELECT user pictures");
                        }
                        else{
                          if(result.length === 0){
                            res.status(200).send("utilisateur supprimé")
                          }
                          else{
                            result.forEach(picture => {
                              fs.unlink(`images/${picture.url.split('/images/')[1]}`, (err => {
                                if (err) console.log(err);
                              }));
                            });
                            db.query("DELETE FROM pictures WHERE iduser=?", userId, (err)=>{
                              if (err) {
                                res.status(400).send("erreur de querry : SELECT user pictures");
                              }
                              else{
                                db.query("DELETE FROM role WHERE iduser=?", userId, (err)=>{
                                  if (err) {
                                    res.status(400).send("erreur de querry : SELECT user pictures");
                                  }
                                  else{
                                    console.log("photos utilisateurs supprimées")
                                    res.status(200).send("utilisateur supprimé")
                                  }
                                })
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
      })
    }
  })
}

//-----------------------------------------------------------------------------------
exports.updateUserPicture = (req, res, next) => {
  const userId =  req.auth.userId
  const adressPicture = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
  console.log(userId)
  console.log(adressPicture)
  if(!req.files[0]){
    res.status(401).send('erreur : photo non envoyé vers api')
  }
  else{
    db.query("DELETE FROM pictures WHERE iduser=? AND isprofile=1", userId, (err)=>{
      if (err) {
        console.log('erreur de suppression de la photo de profil');
      }
      else{
        console.log('photo supprimée de la BDD')
      }
    })
    db.query("SELECT profilepicture FROM users WHERE idusers = ? && profilepicture IS NOT NULL", userId, (err, result) =>{
      if(!result){
        console.log('pas de résultat pour cet id')
      }
      else{
        const filename = result[0].profilepicture;
        fs.unlink(`images/${filename.split('/images/')[1]}`, (err => {
            if (err) console.log(err);
            else {
              console.log("Deleted file in images directory")
            
            }
        }));
      }      
    })
  
    db.query('UPDATE users SET profilepicture=? WHERE idusers=?', [adressPicture, userId], (err) =>{
      if (err) {
        res.status(401).send({message : err.message});
      }
      else{
        console.log("update de user OK")
      }

    })
    db.query("INSERT INTO pictures (url, iduser, isprofile) VALUES (?,?,1)", [adressPicture, userId], (err) => {
      if (err) {
        res.status(401).send({message : err.message});
      }
      else{
        res.status(201).send({fileadress: adressPicture})
      }
    })
  }
}

//-----------------------------------------------------------------------------------
exports.updateUserDescription = (req, res, next) => {
  const userId =  req.auth.userId
  const description = req.body.description


  if(!description){
    res.status('401').send('erreur : description non envoyé vers api')
  }
  else{
    db.query('UPDATE users SET description=? WHERE idusers=?', [description, userId], (err) =>{
      if (err) {
        res.status('401').send(err.message);
      }
      else{
        res.status('200').send("description de l'utilisateur mise à jour")
      }
    })
    
  }
}

exports.researchUser = (req,res,next )=> {
  let resultBuffer= []
  const searchstring = req.params.usersearch.split('&')
    
  for (let i = 0; i < searchstring.length; i++) {
    searchstring[i] =`%${searchstring[i]}%` 
  }
  let eta1 = searchstring.length
  for (let j = 0; j < searchstring.length; j++) {
    db.query('SELECT idusers, description, firstname, lastname, profilepicture FROM users WHERE description LIKE ? OR firstname LIKE ? OR lastname LIKE ?', [searchstring[j],searchstring[j],searchstring[j]], (err, resultuser) =>{
      if(err){
        res.status(400).json({err})}
      else{
        if(resultuser.length !=0){
          for (let k = 0; k < resultuser.length; k++) {
            resultBuffer.push(resultuser[k])
          }
          eta1--
          if(eta1 === 0){
            res.status(200).json(resultBuffer)
          }
        }
        else{
          res.status(200)
        }      
      }
    })       
  }
}

