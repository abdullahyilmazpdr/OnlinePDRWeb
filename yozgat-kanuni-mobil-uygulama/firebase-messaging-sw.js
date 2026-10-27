// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Kanuni Firebase Projesi Yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyCNeqxCCzNo1fzN96PSvHM69m-fdvNxngo",
    projectId: "kanuni-servis-takip-sistemi",
    messagingSenderId: "212596353047",
    appId: "1:212596353047:web:e22b22e56278b6b084d452"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);

// Messaging servisini başlat
const messaging = firebase.messaging();

// Arka planda gelen mesajları dinle
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Arka planda mesaj alındı ', payload);
    
    // Bildirim başlığı ve içeriği
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/img/logo.jpeg',
        badge: '/assets/img/logo.jpeg',
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bildirime tıklandığında uygulamanın açılması
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        // Burada web sitenizin tam adresini yazın. (Örn: https://siteniz.com/kanuni-mobil)
        clients.openWindow('https://onlinepdr.com/yozgat-kanuni-mobil-uygulama') 
    );
});