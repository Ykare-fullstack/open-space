const express = require('express');
const path = require('path');
const app = express();

const publicationRoutes = require('./routes/publication')
const userRoutes = require('./routes/user');
const checkedinRoutes = require('./routes/checkedin')
const commentRoutes = require('./routes/comment')
const likeRoutes = require ('./routes/like')
const roleRoutes = require ('./routes/role')


app.use(express.json());

//header d'accès global à l'API (cors requests)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use('/images', express.static(path.join(__dirname, 'images')));

//routing vers /routes
app.use('/api/user', userRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/checkedin', checkedinRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/appraisal', likeRoutes)
//route d'attribution de roles
app.use('/api/caregiver', roleRoutes)
module.exports = app;