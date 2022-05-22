
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