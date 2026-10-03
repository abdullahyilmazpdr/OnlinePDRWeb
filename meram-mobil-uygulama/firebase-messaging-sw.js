// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js');

// Kendi Firebase projenizin config bilgilerini buraya ekleyin.
// Arka plan bildirimleri için sadece apiKey, projectId, messagingSenderId ve appId yeterlidir.
const firebaseConfig = {
    apiKey: "AIzaSyBUXWMDKUobVMSoCZbWMPAseTdsrb5vuio",
    projectId: "meram-mobil",
    messagingSenderId: "320227235358",
    appId: "1:320227235358:web:b71e941250e64bedec800f"
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
        icon: '/assets/img/icon.png', // Sitenizdeki ikon yolunuza göre güncelleyin
        badge: '/assets/img/icon.png', // Bildirim çubuğunda görünecek küçük ikon
        data: payload.data // Bildirime tıklandığında açılacak URL gibi veriler
    };

    // Bildirimi göster
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bildirime tıklandığında ne olacağını belirle
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Bildirimi kapat
    // Uygulamayı aç (Gerekirse belirli bir sayfaya yönlendirebilirsiniz)
    event.waitUntil(
        clients.openWindow('https://onlinepdr.com/meram-mobil-uygulama') 
    );
});