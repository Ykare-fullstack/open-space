const jwt = require('jsonwebtoken')
const express = require('express')   
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
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