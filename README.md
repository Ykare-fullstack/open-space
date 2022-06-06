
# Open-Space réseau social par Groupomania

## Installation des modules :  

dans le répertoire backend : **npm install**  

dans le répertoire frontend : **npm install**  

## Installation de la base de donnée et connexion :

installer la base de données open-space via **constructor_open_space.sql** situé à la racine (utilisation de MYSql worbench recommandée)

changer les variables d'environnement relatives à votre connection de base de données dans le fichier **.env** dans le répertoire backend (voir **backend/utils/MySqlConnector.js** pour référence de connexion de l'API)  

si la base de donnée ne reconnait pas l'utilisateur (mot de passe trop faible), injecter dans la base de données:  

>`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'votre_password'`  

## Démarrage serveur :

dans le répertoire backend : **nodemon server**

dans le répertoire frontend : **npm run start**

## Liste des modules :


Framework frontend  
[react](https://fr.reactjs.org/)

Icones  
[fontawesome](https://fontawesome.com/v5/docs/web/use-with/react)

Variables d'environnement  
[dotenv](https://www.npmjs.com/package/dotenv)

Throttle/Debounce  
[underscore](https://underscorejs.org/)

Runtime backend  
[node](https://nodejs.org/en/)

Framework Backend  
[express](https://expressjs.com/fr/)

Base de donnée  
[mysql](https://www.mysql.com/fr/)

Securité  
[bcrypt](https://www.bcrypt.fr/)  
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

Lecture de données entrantes  
[body-parser](https://www.npmjs.com/package/body-parser)

Cross-origins  
[cors](https://www.npmjs.com/package/cors)

Gestion des fichiers entrants    
[multer](https://www.npmjs.com/package/multer)

Outils de développement  
[nodemon](https://www.npmjs.com/package/nodemon)  
[prettier](https://prettier.io/)

Compétences évaluées

En vous basant sur les critères d’évaluation du projet, définissez le statut d’acquisition de chaque compétence et commentez à l'aide de ces instructions :

Validé - Commentez si besoin

Non validé - Listez les critères non remplis

</br>

1. Authentifier un utilisateur et maintenir sa session

- [X] Validé 

Commentaires :

    L'utilisateur peut se connecter à l'application avec des identifiants reconnus;
    La session est maintenu jusqu'à ce que l'utilisateur se déconnecte ou ferme la page.
</br>

2. Implémenter un stockage de données sécurisé en utilisant une base de données

- [X] Validé

Commentaires :

    Le mot de passe est haché grace à la bibliothèque bcrypt;
</br>

3. Développer l’interface d’un site web grâce à un framework front-end

- [X] Validé 

Commentaires :

    La technologie ReactJS a été utilisée pour réaliser le frontend.
</br>

Livrable
</br>

Points forts :

    Une attention particulière à la sécurité;
    L'étudiant est allé au delà du cahier de charges.

Axes d'amélioration :

    L'étudiant aurait pu utiliser un orm: sa lui aurait réduit la charge de travail, l'application sera plus simple à maintenir;
    L'étudiant aurait pu créer un middleware pour la validation des données.
</br>

Soutenance

Remarques :

Bravo!!!
</br>
</br>
</br>

English version
--------------------------

Based on the project evaluation criteria, define the level of acquisition of each particular skill as such :

- [X] Validated - Comment if needed

- [ ] Not validated - List all non-filled criteria 

Evaluated skills
</br>

1. Authentify a user and keep it's session active

- [X] Validated 

Commentaries :

The user can connect with nown Id's
Session is maintained until user logout or closes the window.
</br>

2. Implement a secure data storage using a database

- [X] Validé

Commentaries :

    Password is hashed via bcrypt;
</br>

3. Develop a web site interface with a frontend framework

- [X] Validé 

Commentaires :

    React technology has been used to develop the app.
</br>

Delivrable
</br>

Strong points :

    A special attention to security;
    The student went beyond what was expected.

Improvement axes :

    The student could have used an orm to reduce it's workload, the application would be easier to maintain as well;
    The student could have created a middleware to check data.
</br>

Oral presentation

Comentaries :

Bravo!!!