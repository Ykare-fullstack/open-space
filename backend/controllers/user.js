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
//module de création de compte (et initialisation du role)
exports.signup = (req, res, next)=> {

  const userEmail = req.body.email
  const userFirstname = req.body.firstname
  const userLastname = req.body.lastname
  const blankPicture= `${req.protocol}://${req.get('host')}/images/blank-profile-picture.png`
  if(!userEmail || userEmail ===''||!userFirstname || userFirstname ===''|| !userLastname || userLastname ===''||!req.body.password || req.body.password ===''|| req.body.password.length>40 || userEmail.length>40 || userFirstname.length>40|| userLastname.length>40)
  {
    res.status(400).send("la création d'un utilisateur nécessite des informations valides",{created:false})
  }
  else{
    //si paramètres de requête valides :
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
  }
  
};

//-----------------------------------------------------------------------------------
//module de connexion 
//création du token
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
      if(!result[0])
      {
        setTimeout((() => {
          return  res.status(403).send({ access: false })
        }), 2700)  
      }
      else
      { 
        console.log('RESULTAT OBTENU DANS LA BDD') 
        bcrypt.compare(userPassword, result[0].password)
          .then(valid => {
            if (!valid) { 
              setTimeout((() => {
                return   res.status(403).send({ access: false });
              }), 2700)
             
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
                  setTimeout((() => {
                    return   res.status(200).send({
                      access: true,
                      userId: iduser,
                      role: resultrole[0].role,
                      firstname: result[0].firstname,
                      lastname: result[0].lastname,
                      description: result[0].description,
                      profilepicture: result[0].profilepicture,
                      token: jwt.sign({ userId: result[0].idusers,
                      role: resultrole[0].role },'FranK_HerberT_1965_Dune',{ expiresIn: '24h' })
                    });
                  }), 2700)
                  
                }
              })  
            }
          })
      }
    }
  })
}

//-----------------------------------------------------------------------------------
//récupération des informations utilisateur via ID spécifique
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
//récupération des informations de l'utilisateur actuel (page de compte utilisateur)
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
//fonction de mise à jour du mot de passe utilisateur
exports.updateUserPass = (req, res, next) => {
  const userId =  req.auth.userId
  const pass = req.body.pass
  if(!pass||pass===''||pass.length>40)
  {
    res.status('401').send('mot de passe non valide')
  }
  //si les paramètres de requête sont valides :
  else
  {
    bcrypt.hash(pass, 10)
      .then((hash) => {
          db.query('UPDATE users SET password=? WHERE idusers=?', [hash, userId], (err) =>{
            if (err) {
              res.status('401').send(err.message);
            }
            else{
              res.status('200').send("password de l'utilisateur mise à jour")
            }
          }) 
      })
  }
}

//-----------------------------------------------------------------------------------
//fonction de vérification du mot de passe
exports.checkUserPass = (req, res, next) => {
  const userId =req.body.userId
  const userPassword = req.body.pass
  //chaque réponse est timedout afin de ralentir les attaques de force brute
  db.query("SELECT * FROM users WHERE idusers= ?", userId, (err, result) =>{
    if(err)
    {
      console.log('ERREUR DE QUERRY')
      setTimeout((() => {
        return   res.status(401).json({ message: 'erreur de querry',check:false});
      }), 2700)
      
    }
    else
    { 
      if(!result[0])
      { 
        setTimeout((() => {
          return   res.status(200).json({message: "pas d'utilisateur à cet Id",check:false});
        }), 2700)
        
      }
      else
      {
        bcrypt.compare(userPassword, result[0].password)
          .then(valid => {
            if (!valid) {
              setTimeout((() => {
                return   res.status(200).json({ message: 'mot de passe invalide',check:false});
              }), 2700)
            }
            else{
              setTimeout((() => {
                return   res.status(200).json({check:true});
              }), 2700)
            }
          })
      }
    }
  })
}

//-----------------------------------------------------------------------------------
//fonction de suppression d'utilisateur
//chaque champ de la base de donnée contenant d'ID de l'utilisateur sera supprimé
exports.deleteUser = (req, res, next) => {
  const userId =  req.body.userId
  
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
                      db.query("DELETE FROM role WHERE iduser=?", userId, (err)=>{
                        if (err) {
                          res.status(400).send("erreur de querry : SELECT user pictures");
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
                                  else
                                  {
                                    console.log("photos utilisateurs supprimées")
                                    res.status(200).send("utilisateur supprimé")
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
  })
}

//-----------------------------------------------------------------------------------
//fonction de mise à jour de la photo de profil utilisateur
exports.updateUserPicture = (req, res, next) => {
  //suppression de l'ancienne photo de profil et ajout de la nouvelle
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
        if(!filename.split('/images/')[1]==='blank-profile-picture.png')
        {
          fs.unlink(`images/${filename.split('/images/')[1]}`, (err => {
            if (err) console.log(err);
            else {
              console.log("Deleted file in images directory")
            
            }
          })
        )}  
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
//fonction de mise à jour de la bio utilisateur
exports.updateUserDescription = (req, res, next) => {
  const userId =  req.auth.userId
  const description = req.body.description


  if(!description||description===''||description.length>40){
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

//-----------------------------------------------------------------------------------
//fonction de recherche d'un utilisateur via paramètres
exports.researchUser = (req, res, next )=> {
  if(!req.params.usersearch||req.params.usersearch>300)
  {
    res.status(200)
  }
  else
  {
    let resultBuffer= []
    //récupération des critères de recherche dans les paramètres
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
}

