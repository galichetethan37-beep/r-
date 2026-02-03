// server.js - Backend Node.js pour gérer les réservations et notifications push

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Routes HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'colo-vacances.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fichier pour stocker les réservations
const RESERVATIONS_FILE = path.join(__dirname, 'reservations.json');

// Fonction pour charger les réservations
async function loadReservations() {
    try {
        const data = await fs.readFile(RESERVATIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si le fichier n'existe pas, retourner un tableau vide
        return [];
    }
}

// Fonction pour sauvegarder les réservations
async function saveReservations(reservations) {
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
}

// Route pour créer une réservation
app.post('/api/reservation', async (req, res) => {
    try {
        const reservation = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };
        
        // Validation basique
        if (!reservation.childFirstName || !reservation.childLastName || 
            !reservation.email || !reservation.dates || reservation.dates.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Données manquantes ou invalides' 
            });
        }
        
        // Charger les réservations existantes
        const reservations = await loadReservations();
        
        // Ajouter la nouvelle réservation
        reservations.push(reservation);
        
        // Sauvegarder
        await saveReservations(reservations);
        
        // Envoyer la notification push
        await sendPushNotification(reservation);
        
        // Répondre avec succès
        res.json({ 
            success: true, 
            message: 'Réservation enregistrée avec succès',
            reservationId: reservation.id
        });
        
        console.log('✅ Nouvelle réservation:', {
            nom: `${reservation.childFirstName} ${reservation.childLastName}`,
            dates: reservation.dates.join(', ')
        });
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
});

// Route pour récupérer toutes les réservations (admin)
app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await loadReservations();
        res.json({ success: true, reservations });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
});

// Route pour supprimer une réservation (admin)
app.delete('/api/reservation/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let reservations = await loadReservations();
        
        const initialLength = reservations.length;
        reservations = reservations.filter(r => r.id !== id);
        
        if (reservations.length === initialLength) {
            return res.status(404).json({ 
                success: false, 
                message: 'Réservation non trouvée' 
            });
        }
        
        await saveReservations(reservations);
        res.json({ success: true, message: 'Réservation supprimée' });
        
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
});

// Fonction pour envoyer les notifications push
async function sendPushNotification(reservation) {
    // OPTION 1: Firebase Cloud Messaging (FCM)
    // Décommenter et configurer si vous utilisez Firebase
    /*
    const admin = require('firebase-admin');
    
    // Initialiser Firebase (à configurer avec vos credentials)
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: 'VOTRE_PROJECT_ID',
                clientEmail: 'VOTRE_CLIENT_EMAIL',
                privateKey: 'VOTRE_PRIVATE_KEY'
            })
        });
    }
    
    const message = {
        notification: {
            title: '🎉 Nouvelle réservation - Colo Vacances Février',
            body: `${reservation.childFirstName} ${reservation.childLastName} - ${reservation.dates.length} jour(s)`,
        },
        token: 'VOTRE_DEVICE_TOKEN' // Token de votre appareil mobile
    };
    
    try {
        const response = await admin.messaging().send(message);
        console.log('🔔 Notification FCM envoyée:', response);
    } catch (error) {
        console.error('❌ Erreur FCM:', error);
    }
    */
    
    // OPTION 2: Web Push API
    // Décommenter si vous utilisez web-push
    /*
    const webpush = require('web-push');
    
    // Configuration VAPID (à générer)
    webpush.setVapidDetails(
        'mailto:votre@email.com',
        'VOTRE_PUBLIC_VAPID_KEY',
        'VOTRE_PRIVATE_VAPID_KEY'
    );
    
    const payload = JSON.stringify({
        title: '🎉 Nouvelle réservation',
        body: `${reservation.childFirstName} ${reservation.childLastName}`,
        icon: '/icon.png',
        data: reservation
    });
    
    // Subscription de votre appareil (à stocker)
    const subscription = {
        endpoint: 'VOTRE_ENDPOINT',
        keys: {
            p256dh: 'VOTRE_P256DH_KEY',
            auth: 'VOTRE_AUTH_KEY'
        }
    };
    
    try {
        await webpush.sendNotification(subscription, payload);
        console.log('🔔 Notification Web Push envoyée');
    } catch (error) {
        console.error('❌ Erreur Web Push:', error);
    }
    */
    
    // OPTION 3: Service tiers (Pushover, OneSignal, etc.)
    // Exemple avec Pushover
    /*
    const axios = require('axios');
    
    try {
        await axios.post('https://api.pushover.net/1/messages.json', {
            token: 'VOTRE_APP_TOKEN',
            user: 'VOTRE_USER_KEY',
            message: `Nouvelle réservation: ${reservation.childFirstName} ${reservation.childLastName}`,
            title: '🎿 Colo Vacances Février',
            priority: 1
        });
        console.log('🔔 Notification Pushover envoyée');
    } catch (error) {
        console.error('❌ Erreur Pushover:', error);
    }
    */
    
    // OPTION 4: Email (solution simple et fiable)
    // Décommenter si vous utilisez nodemailer
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
        service: 'gmail', // ou autre service
        auth: {
            user: 'votre@email.com',
            pass: 'votre_mot_de_passe_app'
        }
    });
    
    const mailOptions = {
        from: 'noreply@colo-vacances.fr',
        to: 'votre@mobile.email', // Email lié à votre mobile
        subject: '🎉 Nouvelle réservation - Colo Vacances',
        html: `
            <h2>Nouvelle réservation reçue</h2>
            <p><strong>Enfant:</strong> ${reservation.childFirstName} ${reservation.childLastName}</p>
            <p><strong>Âge:</strong> ${reservation.childAge} ans</p>
            <p><strong>Responsable:</strong> ${reservation.parentName}</p>
            <p><strong>Email:</strong> ${reservation.email}</p>
            <p><strong>Téléphone:</strong> ${reservation.phone}</p>
            <p><strong>Dates:</strong> ${reservation.dates.join(', ')}</p>
            <p><strong>Heure:</strong> ${new Date(reservation.timestamp).toLocaleString('fr-FR')}</p>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 Email de notification envoyé');
    } catch (error) {
        console.error('❌ Erreur email:', error);
    }
    */
    
    // Pour le développement: affichage console
    console.log('🔔 NOTIFICATION PUSH:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Nouvelle réservation - Colo Vacances Février');
    console.log(`👤 ${reservation.childFirstName} ${reservation.childLastName} (${reservation.childAge} ans)`);
    console.log(`📅 Dates: ${reservation.dates.join(', ')}`);
    console.log(`👨‍👩‍👧 Responsable: ${reservation.parentName}`);
    console.log(`📧 ${reservation.email}`);
    console.log(`📱 ${reservation.phone}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('🚀 Serveur démarré sur le port', PORT);
    console.log(`📍 http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Prêt à recevoir des réservations !');
});

module.exports = app;
