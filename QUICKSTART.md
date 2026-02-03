# 🚀 Guide de Démarrage Rapide

## Installation en 3 minutes

### 1️⃣ Installation
```bash
npm install
```

### 2️⃣ Démarrage
```bash
npm start
```

### 3️⃣ Utilisation
- **Page publique** : http://localhost:3000
- **Admin** : http://localhost:3000/admin

C'est tout ! 🎉

---

## 🔔 Activer les Notifications (Optionnel)

### Solution Simple : Email

1. Ouvrir `server.js`
2. Aller à la ligne 155
3. Décommenter le code Email
4. Configurer :
   - `user`: votre email Gmail
   - `pass`: mot de passe d'application Gmail
   - `to`: email de votre mobile

**Générer un mot de passe Gmail** :
1. Google Account → Sécurité
2. Validation en 2 étapes → Activer
3. Mots de passe d'applications → Créer
4. Copier le mot de passe dans le code

---

## 📱 Tester

1. Ouvrir http://localhost:3000
2. Remplir le formulaire
3. Soumettre
4. Vérifier :
   - ✅ Message de succès
   - 📧 Email reçu (si configuré)
   - 💾 Réservation dans admin

---

## 🎯 Raccourcis Utiles

### Voir les réservations
```
http://localhost:3000/admin
```

### API directe
```bash
# Voir toutes les réservations
curl http://localhost:3000/api/reservations

# Supprimer une réservation
curl -X DELETE http://localhost:3000/api/reservation/[ID]
```

---

## ⚙️ Personnaliser

### Couleurs
`colo-vacances.html` ligne 14-24

### Ajouter une activité
`colo-vacances.html` ligne 670 (HTML) + 920 (JS)

### Modifier les dates
`colo-vacances.html` ligne 770

---

## 🚨 Problèmes Courants

### Port 3000 déjà utilisé
```bash
# Trouver le processus
lsof -i :3000
# Le tuer
kill -9 [PID]
```

### Notifications ne marchent pas
1. Vérifier permissions navigateur
2. Consulter console (F12)
3. Vérifier config email

### Module manquant
```bash
npm install
```

---

## 📦 Déploiement Production

### Heroku (gratuit)
```bash
heroku create
git push heroku main
heroku open
```

### Vercel (gratuit)
```bash
npx vercel
```

### Render (gratuit)
1. render.com
2. New Web Service
3. Connect repo
4. Deploy

---

## 🎓 Besoin d'aide ?

Consultez le `README.md` complet pour :
- Configuration détaillée
- Options de notifications
- Sécurité
- Troubleshooting avancé

---

**Bon développement ! 🎿❄️**
