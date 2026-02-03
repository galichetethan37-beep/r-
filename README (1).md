# 🎿 Colo Vacances de Février 2026

Site web complet de réservation pour une colonie de vacances avec animations, formulaire interactif et notifications push.

## ✨ Fonctionnalités

- **🎨 Design moderne et animé** : Animations fluides, esthétique ludique hivernale
- **📅 Programme interactif** : Boutons cliquables avec détails de chaque activité
- **📝 Formulaire de réservation** : Validation, réinitialisation automatique
- **🔔 Notifications push** : Alertes sur mobile à chaque nouvelle réservation
- **📱 100% Responsive** : Adapté mobile, tablette et desktop
- **💾 Stockage des données** : Sauvegarde JSON des réservations

## 🚀 Installation Rapide

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn
- Un navigateur moderne

### Étapes d'installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Démarrer le serveur**
```bash
npm start
```

3. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

Le fichier `colo-vacances.html` sera accessible automatiquement.

## 📁 Structure du Projet

```
colo-vacances/
├── colo-vacances.html    # Page web principale
├── server.js             # Backend Node.js
├── package.json          # Dépendances
├── reservations.json     # Base de données (créée automatiquement)
└── README.md            # Documentation
```

## 🔔 Configuration des Notifications Push

Le système de notifications push est configuré avec plusieurs options. Choisissez celle qui convient le mieux :

### Option 1: Notifications Email (Recommandé - Simple)

Décommentez le code dans `server.js` (ligne ~155) et configurez :

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'votre@email.com',
        pass: 'votre_mot_de_passe_application'  // Générez un mot de passe d'application Gmail
    }
});
```

**Avantages** :
- Simple à configurer
- Fonctionne sur tous les appareils
- Notifications fiables

**Configuration Gmail** :
1. Activer la validation en 2 étapes
2. Générer un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Utilisez ce mot de passe dans le code

### Option 2: Firebase Cloud Messaging (FCM)

Pour les notifications mobiles natives :

```bash
npm install firebase-admin
```

Décommentez le code FCM dans `server.js` (ligne ~85) et configurez :

```javascript
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'votre-project-id',
        clientEmail: 'votre-client-email',
        privateKey: 'votre-private-key'
    })
});
```

**Configuration** :
1. Créer un projet Firebase : https://console.firebase.google.com
2. Télécharger le fichier de clés privées
3. Installer l'app Firebase sur votre mobile
4. Récupérer votre token device

### Option 3: Web Push API

Pour les notifications dans le navigateur :

```bash
npm install web-push
```

**Générer les clés VAPID** :
```bash
npx web-push generate-vapid-keys
```

### Option 4: Services tiers

**Pushover** (très simple, 5$ one-time)
```bash
npm install axios
```

Inscription : https://pushover.net

**OneSignal** (gratuit)
https://onesignal.com

## 🎯 Utilisation

### Pour les visiteurs

1. Parcourir le programme des vacances
2. Cliquer sur les activités pour voir les détails
3. Remplir le formulaire de réservation
4. Sélectionner les dates souhaitées
5. Soumettre la réservation

### Pour l'administrateur

#### Voir toutes les réservations
```bash
curl http://localhost:3000/api/reservations
```

Ou ouvrez dans le navigateur : `http://localhost:3000/api/reservations`

#### Supprimer une réservation
```bash
curl -X DELETE http://localhost:3000/api/reservation/[ID]
```

#### Consulter les réservations
Le fichier `reservations.json` contient toutes les données :
```json
[
  {
    "id": "1706789123456",
    "timestamp": "2026-02-01T10:30:00.000Z",
    "childFirstName": "Emma",
    "childLastName": "Dupont",
    "childAge": "10",
    "parentName": "Marie Dupont",
    "email": "marie.dupont@email.com",
    "phone": "0612345678",
    "dates": ["Mercredi 29 Jan", "Vendredi 31 Jan"]
  }
]
```

## 🌐 Déploiement en Production

### Sur Heroku (gratuit)

1. **Créer un compte** : https://heroku.com

2. **Installer Heroku CLI**
```bash
npm install -g heroku
heroku login
```

3. **Déployer**
```bash
heroku create colo-vacances-fevrier
git init
git add .
git commit -m "Initial commit"
git push heroku main
heroku open
```

### Sur Vercel (gratuit)

1. **Installer Vercel CLI**
```bash
npm install -g vercel
```

2. **Déployer**
```bash
vercel
```

### Sur Railway (gratuit)

1. Créer un compte : https://railway.app
2. Connecter votre repository GitHub
3. Railway détecte automatiquement Node.js et déploie

### Sur Render (gratuit)

1. Créer un compte : https://render.com
2. New > Web Service
3. Connecter repository ou uploader code
4. Build Command: `npm install`
5. Start Command: `node server.js`

## 🔧 Personnalisation

### Modifier les couleurs

Dans `colo-vacances.html`, ligne 14-24 :
```css
:root {
    --color-sky: #E3F2FF;
    --color-pink: #FFB4D6;
    --color-violet: #D4B4FF;
    /* ... */
}
```

### Ajouter des activités

1. Ajouter un bouton dans la grille (ligne ~670)
2. Ajouter la description dans l'objet `activities` (ligne ~920)

### Modifier les dates

Mettre à jour la section `dates-selection` (ligne ~770)

## 📱 Test des Notifications

### Test navigateur
1. Ouvrir la page
2. Accepter les notifications
3. Soumettre une réservation
4. Une notification apparaît immédiatement

### Test mobile
1. Configurer FCM ou email
2. Utiliser votre token/email
3. Soumettre depuis n'importe quel appareil
4. Recevoir la notification sur votre mobile

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3000 est libre
lsof -i :3000
# Si occupé, tuer le processus
kill -9 [PID]
```

### Les notifications ne fonctionnent pas
1. Vérifier les permissions du navigateur
2. Vérifier la console (F12) pour les erreurs
3. Vérifier les logs du serveur

### Les réservations ne s'enregistrent pas
1. Vérifier que `reservations.json` est créé
2. Vérifier les permissions d'écriture
3. Consulter les logs du serveur

## 📊 Statistiques et Analytics

Pour ajouter Google Analytics :
```html
<!-- Dans le <head> de colo-vacances.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔐 Sécurité

Pour la production, ajouter :

1. **Rate limiting**
```bash
npm install express-rate-limit
```

2. **Validation des données**
```bash
npm install express-validator
```

3. **HTTPS** (automatique sur Heroku/Vercel/Railway/Render)

4. **Variables d'environnement**
Créer un fichier `.env` :
```
PORT=3000
EMAIL_USER=votre@email.com
EMAIL_PASS=votre_mot_de_passe
```

## 📞 Support

Pour toute question ou assistance :
- 📧 Email : support@colo-vacances.fr (à adapter)
- 💬 GitHub Issues : [lien repository]

## 📝 Licence

MIT License - Libre d'utilisation et de modification

## 🎉 Crédits

Développé avec ❤️ pour offrir une expérience de réservation moderne et ludique.

---

**Bonne chance pour votre colonie de vacances ! 🎿❄️✨**
