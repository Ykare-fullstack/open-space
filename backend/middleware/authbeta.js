const jwt = require('jsonwebtoken')
const express = require('express')   
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
//module d'authorisation beta : 
//requiert un jwt valide 
//et être le propriétaire de la ressource ou autorité de niveau 2 minimum
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, 'FranK_HerberT_1965_Dune')
    const userId = decodedToken.userId
    const role = decodedToken.role
    req.auth = {userId}
    let givenId
    if(req.body.userId){
      givenId=req.body.userId}
    else{
      givenId=Number(req.params.id)}

    if(role>1 || givenId===userId){
      next();
    }
    else  
      res.status(403).send({message:err.message})
      
  } catch(err) {
    res.status(403).send({message:err.message})
  }
};