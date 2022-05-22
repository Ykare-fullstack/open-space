
# Open-Space réseau social par Groupomania

## Installation des modules :  

dans le répertoire backend : npm install  

dans le répertoire frontend : npm install  

## Installation de la base de donnée et connexion :

installer la base de données open-space via **constructor_open_space.sql** situé à la racine 

changer les variables d'environnement relatives à votre connection de base de données dans le fichier **.env** dans le répertoire backend (voir **backend/utils/MySqlConnector.js** pour référence de connexion de l'API)  

si la base de donnée ne reconnait pas l'utilisateur (mot de passe trop faible), injecter dans la base de données:  

> `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`  

en remplaçant password par vos informations de connexion  

## Démarrage serveur :

dans le répertoire backend : *nodemon server*

dans le répertoire frontend : *npm run start*
