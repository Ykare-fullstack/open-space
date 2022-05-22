

const jwt = require('jsonwebtoken');
const express = require('express');   
const app = express();
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));


//module d'authorisation alpha : requiert un jwt valide
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'FranK_HerberT_1965_Dune');
    const userId = decodedToken.userId;
    req.auth = {userId};
    if (req.body.userId && req.body.userId !== userId) {
        throw 'Invalid user ID';}
    else{
        next();
      }
  } catch(err) {
    res.status(403).send({message:err.message})
  }
}