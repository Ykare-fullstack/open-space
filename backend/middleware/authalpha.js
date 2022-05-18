const jwt = require('jsonwebtoken');
const express = require('express');   
const app = express();
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
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