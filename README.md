# Projet de Site de Commerce Électronique

Ce projet est un site de commerce électronique développé avec React pour le frontend et Symfony pour le backend. Le site permet aux utilisateurs de parcourir une sélection de produits, de les ajouter à leur panier et de passer des commandes.

## Fonctionnalités

- Affichage des produits avec leurs détails (nom, description, prix, etc.).
- Ajout de produits au panier.
- Affichage du panier avec la liste des produits ajoutés et leur total.
- Passage de commandes avec enregistrement des informations utilisateur et des produits achetés.
- Gestion des utilisateurs avec authentification.

## Prérequis

- Node.js
- Docker
- Docker Compose

## Installation

1. Cloner le dépôt GitHub :

   ```bash
   git clone https://github.com/SammuelLeroux/site-e-commerce-vente_tv.git

## Accéder au répertoire du projet :

- cd site-e-commerce-vente_tv

## Installer les dépendances du frontend :

- cd client
- npm install

## Revenir au répertoire principal du projet :

- cd ..

## Construire et démarrer les conteneurs Docker :

- docker compose up --build

## Monter la base de donnée
- cd ..
- symfony console make:migration ou symfony console m:mi
- symfony console doctrine:migrations:migrate ou symfony console d:m:m

Attendre que les conteneurs soient prêts, puis accéder au site dans votre navigateur à l'adresse http://localhost:3000.

## Utilisation
Le site est maintenant accessible via Docker. Vous pouvez accéder aux fonctionnalités comme décrit dans la section précédente.


