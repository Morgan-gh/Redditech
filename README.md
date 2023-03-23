# REDDITECH PROJECT (work on IOS and Android)

# Preview (left : mockup / right : real app)
>![LOGIN MOCK](https://user-images.githubusercontent.com/110362553/225857144-6fb278c9-47dc-4516-a1e3-0dfedc5909af.jpg)
>![HOME MOCK](https://user-images.githubusercontent.com/110362553/225857142-ee048fc7-621c-4623-98d7-5de538ccd298.jpg)
>![SEARCH MOCK](https://user-images.githubusercontent.com/110362553/225857147-bf654b9b-7ebf-44e7-ad35-8d9efb35fe7a.jpg)
>![USER MOCK](https://user-images.githubusercontent.com/110362553/225857140-02c216d9-7cb8-4a08-bbbd-64cb510cc517.jpg)

# Archi
>m3 folder -> Application  
>Doc folder -> Documentation about Redditech project

# Start
>cd m3 / npx expo start OR npm start

# Documentation
## Adapter le projet
1. Lancer le projet à l'aide de la commande ```npm start```
2. Récupèrer sous le QR Code ```exp://000.000.0.00:19000``` (Les 0 seront remplacer par vos valeurs)
3. Ensuite aller sur ```https://www.reddit.com/prefs/apps``` pour créer une nouvelle application Reddit 
    1. Entrer le nom de votre application
    2. Choisir ```Application installée```
    3. Mettre ```exp://000.000.0.00:19000``` dans ```rediriger uri``` 
    4. Appuyer sur ```créer une application```
    5. Récupèrer le  ```ClientId``` qui se trouve en dessous de ```Application installée```
4. Modifier dans le fichier ```Login.js```
    1. La valeur de la variable ```ClientId``` par celle récupèré dans l'étape 3.5
    2. La valeur de la variable ```redirectUri``` par votre ```exp://000.000.0.00:19000``` récupèré dans l'étape 2
5. Arrêter le programme en faisant ```Ctrl + C``` puis relancer le avec ```npm start```

## Que trouver dans ce projet ?
1. Page de connexion
    - Une fois votre application lancée et adaptée, vous arriverez sur la ```page de connexion```. Cette page vous propose de vous ```connecter en appuyant sur un bouton```. Ce bouton vous ```redirige vers la page officielle de Reddit``` pour permettre au programme d'obtenir un ```Token d'accès```.
2. Page acceuil
    - Une fois que vous vous êtes ```connecté à l'aide de votre compte Reddit```, cette page est celle sur laquelle vous allez être ```redirigé(e)```. Vous y trouverez tous les ```subreddits auxquels votre compte est inscrit```. Vous pouvez aussi, pour chaque subreddit affiché, ```voir les threads les plus populaires``` ainsi que les ```commentaires``` qui y sont rattachés.
1. Page recherche
    - Grâce à la barre de navigation, vous verrez une ```icône loupe```. C'est ici que vous trouverez la ```page de recherche```. Dans cette page, vous pouvez ```rechercher un subreddit```, vous y ```abonner``` et vous ```désabonner```. Vous pouvez également ```rechercher les posts``` en fonction de leur ```popularité```, des plus ```récents```, des plus ```tendances``` ou des plus ```chauds```.
1. Page user
    - Dans la barre de navigation, ```l'icône profil``` permet d'accéder à la ```page profil de l'utilisateur```. C'est ici que vous pouvez ```consulter``` certains éléments de votre profil comme votre ```image de profil```, votre ```pseudo``` ou bien votre ```description```. Dans cette page vous pouvez aussi ```consulter et modifier``` les ```paramètres du compte```. Cette page permet également de ```se déconnecter``` et de revenir à la page de connexion.

# Test manuels
## Vérifier que l'OAuth2 Marche :
1. Ouvrir le projet sur un ```téléphone``` / ```émulateur```.
2. Appuyer sur le bouton ```"Sign in"``` pour être redirigé sur la page officielle de Reddit.
    1. Sur cette page, il doit y avoir ```tous les champs d'autorisations``` pour le token.
3. Après avoir appuyé sur ```"Accept"```, vous allez être redirigé sur la page ```"Home"```.
    1. ```En haut à droite``` de cette page, si vous voyez ```votre nom d'utilisateur``` et ```votre image de profil```, alors l'OAuth2 a fonctionné.

## Vérifier que les modifications de profil marche :
1. Aller sur ```Reddit.com``` en étant connecté, regardez si vous êtes en mode Nightmode ou non.
2. Une fois ```connecté au projet```, aller sur la ```page de profil``` (en bas à droite).
3. Éditer le paramètre ```"Nightmode"```, puis enregistrer le paramètre en appuyant sur ```"Valider"```.
4. Retourner sur Reddit.com et ```actualiser la page```.
    1. Si le mode ```"Nightmode"``` a changé (```passer de sombre à clair ou inversement```), alors les ```modifications de profil ont fonctionné```.

## Vérifier que l'abonnement à un subreddit marche :
1. Aller sur ```Reddit.com``` en étant connecté, regardez dans la liste de ```vos subreddits suivis``` et vérifiez si vous êtes ```abonné ou non``` au subreddit ```"Dofus"```.
2. Une fois ```connecté au projet```, aller sur la ```page d'accueil``` et ```si vous êtes abonné```, vérifiez qu'il est bien ```présent```. ```Sinon```, il ne devrait ```pas apparaître```.
3. Aller maintenant sur la ```page de recherche```, entrez ```"Dofus"``` dans la barre de recherche, une fois trouvé, et ```selon que vous soyez abonné ou non```, vous trouverez un ```bouton "s'abonner" ou "se désabonner"``` sur lequel il faudra ```appuyer```.
    1. Retournez sur ```Reddit.com``` en étant connecté, regardez dans la liste de vos subreddits suivis et vérifiez si vous êtes ```abonné ou non à "Dofus"``` en fonction de votre action précédente.
    2. Retournez sur la ```page d'accueil``` et vérifiez ```si "Dofus" est présent ou non``` en fonction de l'action effectuée.
4. Si ```3.1 et 3.2``` sont ```valides```, alors ```l'abonnement a fonctionné```.

# Documentation
## Adapter le projet
1. Lancer le projet à l'aide de la commande ```npm start```
2. Récupèrer sous le QR Code ```exp://000.000.0.00:19000``` (Les 0 seront remplacer par vos valeurs)
3. Ensuite aller sur ```https://www.reddit.com/prefs/apps``` pour créer une nouvelle application Reddit 
    1. Entrer le nom de votre application
    2. Choisir ```Application installée```
    3. Mettre ```exp://000.000.0.00:19000``` dans ```rediriger uri``` 
    4. Appuyer sur ```créer une application```
    5. Récupèrer le  ```ClientId``` qui se trouve en dessous de ```Application installée```
4. Modifier dans le fichier ```Login.js```
    1. La valeur de la variable ```ClientId``` par celle récupèré dans l'étape 3.5
    2. La valeur de la variable ```redirectUri``` par votre ```exp://000.000.0.00:19000``` récupèré dans l'étape 2
5. Arrêter le programme en faisant ```Ctrl + C``` puis relancer le avec ```npm start```

## Que trouver dans ce projet ?
1. Page de connexion
    - Une fois votre application lancée et adaptée, vous arriverez sur la ```page de connexion```. Cette page vous propose de vous ```connecter en appuyant sur un bouton```. Ce bouton vous ```redirige vers la page officielle de Reddit``` pour permettre au programme d'obtenir un ```Token d'accès```.
2. Page acceuil
    - Une fois que vous vous êtes ```connecté à l'aide de votre compte Reddit```, cette page est celle sur laquelle vous allez être ```redirigé(e)```. Vous y trouverez tous les ```subreddits auxquels votre compte est inscrit```. Vous pouvez aussi, pour chaque subreddit affiché, ```voir les threads les plus populaires``` ainsi que les ```commentaires``` qui y sont rattachés.
1. Page recherche
    - Grâce à la barre de navigation, vous verrez une ```icône loupe```. C'est ici que vous trouverez la ```page de recherche```. Dans cette page, vous pouvez ```rechercher un subreddit```, vous y ```abonner``` et vous ```désabonner```. Vous pouvez également ```rechercher les posts``` en fonction de leur ```popularité```, des plus ```récents```, des plus ```tendances``` ou des plus ```chauds```.
1. Page user
    - Dans la barre de navigation, ```l'icône profil``` permet d'accéder à la ```page profil de l'utilisateur```. C'est ici que vous pouvez ```consulter``` certains éléments de votre profil comme votre ```image de profil```, votre ```pseudo``` ou bien votre ```description```. Dans cette page vous pouvez aussi ```consulter et modifier``` les ```paramètres du compte```. Cette page permet également de ```se déconnecter``` et de revenir à la page de connexion.

# Test manuels
## Vérifier que l'OAuth2 Marche :
1. Ouvrir le projet sur un ```téléphone``` / ```émulateur```.
2. Appuyer sur le bouton ```"Sign in"``` pour être redirigé sur la page officielle de Reddit.
    1. Sur cette page, il doit y avoir ```tous les champs d'autorisations``` pour le token.
3. Après avoir appuyé sur ```"Accept"```, vous allez être redirigé sur la page ```"Home"```.
    1. ```En haut à droite``` de cette page, si vous voyez ```votre nom d'utilisateur``` et ```votre image de profil```, alors l'OAuth2 a fonctionné.

## Vérifier que les modifications de profil marche :
1. Aller sur ```Reddit.com``` en étant connecté, regardez si vous êtes en mode Nightmode ou non.
2. Une fois ```connecté au projet```, aller sur la ```page de profil``` (en bas à droite).
3. Éditer le paramètre ```"Nightmode"```, puis enregistrer le paramètre en appuyant sur ```"Valider"```.
4. Retourner sur Reddit.com et ```actualiser la page```.
    1. Si le mode ```"Nightmode"``` a changé (```passer de sombre à clair ou inversement```), alors les ```modifications de profil ont fonctionné```.

## Vérifier que l'abonnement à un subreddit marche :
1. Aller sur ```Reddit.com``` en étant connecté, regardez dans la liste de ```vos subreddits suivis``` et vérifiez si vous êtes ```abonné ou non``` au subreddit ```"Dofus"```.
2. Une fois ```connecté au projet```, aller sur la ```page d'accueil``` et ```si vous êtes abonné```, vérifiez qu'il est bien ```présent```. ```Sinon```, il ne devrait ```pas apparaître```.
3. Aller maintenant sur la ```page de recherche```, entrez ```"Dofus"``` dans la barre de recherche, une fois trouvé, et ```selon que vous soyez abonné ou non```, vous trouverez un ```bouton "s'abonner" ou "se désabonner"``` sur lequel il faudra ```appuyer```.
    1. Retournez sur ```Reddit.com``` en étant connecté, regardez dans la liste de vos subreddits suivis et vérifiez si vous êtes ```abonné ou non à "Dofus"``` en fonction de votre action précédente.
    2. Retournez sur la ```page d'accueil``` et vérifiez ```si "Dofus" est présent ou non``` en fonction de l'action effectuée.
4. Si ```3.1 et 3.2``` sont ```valides```, alors ```l'abonnement a fonctionné```.

# Techno
>React Native

# Dev
>Morgan / Maxence.B / Maxence.L
