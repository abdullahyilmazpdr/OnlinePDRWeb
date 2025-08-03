<?php
// Formdan gelen verileri al
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

// Mail gönderilecek adres
$to = 'abdullahyilmazpdr@gmail.com'; // BURAYA kendi e-posta adresini yaz

// E-posta başlığı
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Mesaj içeriği
$body = "Ad Soyad: $name\n";
$body .= "Email: $email\n";
$body .= "Konu: $subject\n\n";
$body .= "Mesaj:\n$message\n";

// Mail gönder
if(mail($to, $subject, $body, $headers)){
    echo 'Mesajınız gönderildi. Teşekkürler!';
} else {
    echo 'Bir hata oluştu, lütfen tekrar deneyin.';
}
?>
