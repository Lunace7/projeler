// Şifre Sıfırlama Simülasyonu 
// Bu dosya, backend olmadan şifre sıfırlama işlemlerini test etmek amacıyla simüle edilmeye çalışılmıştır.

/**
 * Kullanıcı mesajlarını ekranda göstermek için bir fonksiyon.
 * @param {string} mesaj - Kullanıcıya gösterilecek mesaj.
 * @param {string} tip - Mesaj tipi (success, danger, info vs gibi).
 */
function mesajGoster(mesaj, tip = "success") {
    // Mesaj kutusunu seç
    const mesajKutusu = document.getElementById("mesajKutusu");
    mesajKutusu.textContent = mesaj; // Mesaj içeriğini ayarla
    mesajKutusu.className = "mesaj-kutusu " + tip; // Mesajın türüne göre sınıf ekle

    // Mesajı 5 saniye sonra kaldır
    setTimeout(() => {
        mesajKutusu.textContent = "";
        mesajKutusu.className = "mesaj-kutusu";
    }, 5000);
}

// Şifre Sıfırlama Formu 
// Formun gönderim işlemini dinleyen event listener.
document.getElementById("sifreSifirlaForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle

    // Formdaki e-posta girişini al
    const email = document.getElementById("email").value.trim();

    // Eğer e-posta alanı boşsa kullanıcıyı uyar
    if (!email) {
        mesajGoster("Lütfen e-posta adresinizi giriniz.", "danger");
        return;
    }

    // Simülasyon: Şifre sıfırlama bağlantısı gönderiliyor
    mesajGoster("Şifre sıfırlama bağlantısı e-posta adresinize gönderiliyor...", "info");

    // 2 saniyelik bekleme simülasyonu
    setTimeout(() => {
        // Kullanıcıya başarı mesajı göster
        mesajGoster("Şifre sıfırlama bağlantısı başarıyla gönderildi!", "success");
    }, 2000);
});
