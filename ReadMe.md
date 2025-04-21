## Fonctionnalités de l'application

### `env.js`
- Permet de configurer l’adresse IP du serveur.  
  ➜ En cas de changement de réseau, il suffit de modifier ce fichier.

### `App.js`
- Point d'entré principal de l’application.
- Gère la navigation entre les différents écrans.

### `login.js`
- Connexion via *email* et *mot de passe*.
- Génère un **token** à la connexion, puis redirige vers le `menu`.
- Prévient l'utilisateur si un champ est vide ou si les identifiants sont incorrects.
- Contient un lien vers la page `register`.

### `register.js`
- Création d’un nouveau profil utilisateur.
- Empêche l’inscription si l’email ou le nom est déjà utilisé.
- Redirige vers la page de connexion après création.
- Le mot de passe est hashé pour renforcer la sécurité.

### `menu.js`
- Point central de l’application, regroupe les accès aux différentes fonctionnalités.
- Bouton **Déconnexion** (présent ici et dans tous les écrans suivants):
  - Supprime le token
  - Vide la pile de navigation
  - Redirige vers la page de connexion
- Si aucun token n’est présent, redirection automatique vers `login`.
- Une carte purement esthétique est affichée en arrière-plan.

### `map.js`
- Affiche les caches géolocalisées autour de la zone visible sur l'écran.
- **Marqueurs de couleur** :
  - Vert : caches de l'utilisateur
  - Gris : caches déjà trouvées
  - Rouge : caches à découvrir
- En cliquant sur un marqueur :
  - Affichage du niveau de difficulté, pseudo du créateur et description
  - Bouton pour être redirigé vers `list` l'avec l'id de la cache en argument
- Bouton **Se localiser** : centre la carte sur l’utilisateur (utile pour iOS qui ne semble pas disposer de cette fonction par défaut).
- Si la localisation est impossible, les coordonnées de l'enseirb sont utilisées par défaut.

### `list.js`
- Liste paginée (10 caches par page), triée des plus récentes aux plus anciennes.
- Affiche : créateur, date, description, etc.
- Filtres disponibles :
  - Note, difficulté, date, créateur, statut (déjà trouvée par quelqu'un ou non)
- Fonctionnalités : 
  - Ajout une cache (Latitude/longitude préremplies via carte interactive)
  - Redirection vers la carte centrée sur une cache spécifique
  - Modification ou suppression de ses propres caches
  - Saisie d’un code de 6 caractères pour valider une cache qui n'est pas à l'utilisateur
  - Une fois validée, possibilité de **noter** la cache (le vote peut être modifié ultérieurement)
- Mise à jour automatique à chaque modification.

### `ranking.js`
- Classements disponibles :

  **Top 3 des chercheurs** selon le nombre et la difficulté des caches trouvées

  **Top 3 des meilleures caches** selon leur score  
    - redirection vers `list` au clic.

  **Top 3 des caches les moins trouvées** selon le ratio "trouvailles / durée de vie"  
    - redirection vers `list` au clic.

- Mise à jour automatique si en remonte la pile depuis `list`.

