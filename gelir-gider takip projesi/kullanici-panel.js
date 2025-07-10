document.addEventListener('DOMContentLoaded', () => {
    // Aktif kullanıcıyı al
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    if (!aktifKullanici) {
        alert('Lütfen giriş yapınız.');
        window.location.href = 'giris.html';
        return;
    }

    // Kullanıcı bilgilerini doldur
    const adSoyadInput = document.getElementById('adSoyad');
    const emailInput = document.getElementById('email');
    const hosgeldinizMesaji = document.getElementById('hosgeldinizMesaji');

    if (aktifKullanici) {
        adSoyadInput.value = aktifKullanici.adSoyad;
        emailInput.value = aktifKullanici.email;
        hosgeldinizMesaji.textContent = `Merhaba, ${aktifKullanici.adSoyad}`;
    }

    // Profil bilgileri formunu dinle
    const profilBilgileriForm = document.getElementById('profilBilgileriForm');
    if (profilBilgileriForm) {
        profilBilgileriForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const yeniAdSoyad = adSoyadInput.value.trim();
            const yeniEmail = emailInput.value.trim();

            if (!yeniAdSoyad || !yeniEmail) {
                mesajGoster('Lütfen tüm alanları doldurun.', 'danger');
                return;
            }

            // Kullanıcı bilgilerini güncelle
            aktifKullanici.adSoyad = yeniAdSoyad;
            aktifKullanici.email = yeniEmail;

            // localStorage'de kullanıcıyı güncelle
            let kullanicilar = JSON.parse(localStorage.getItem('kullanicilar')) || [];
            const index = kullanicilar.findIndex(kullanici => kullanici.kullaniciAdi === aktifKullanici.kullaniciAdi);

            if (index !== -1) {
                kullanicilar[index] = aktifKullanici;
                localStorage.setItem('kullanicilar', JSON.stringify(kullanicilar));
            }

            // Aktif kullanıcıyı güncelle
            localStorage.setItem('aktifKullanici', JSON.stringify(aktifKullanici));

            mesajGoster('Profil bilgileri başarıyla güncellendi.', 'success');
            hosgeldinizMesaji.textContent = `Merhaba, ${yeniAdSoyad}!`;
        });
    }

    // Navbar'daki kullanıcı adını güncelle
    const navbarKullaniciAdi = document.getElementById('kullaniciAdi');
    if (navbarKullaniciAdi && aktifKullanici.adSoyad) {
    navbarKullaniciAdi.textContent = aktifKullanici.adSoyad;
    }


    // Şifre değiştirme formunu dinle
    const sifreDegistirForm = document.getElementById('sifreDegistirForm');
    if (sifreDegistirForm) {
        sifreDegistirForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const eskiSifre = document.getElementById('eskiSifre').value.trim();
            const yeniSifre = document.getElementById('yeniSifre').value.trim();

            if (eskiSifre !== aktifKullanici.sifre) {
                mesajGoster('Eski şifre hatalı.', 'danger');
                return;
            }

            if (!yeniSifre || yeniSifre.length < 6) {
                mesajGoster('Yeni şifre en az 6 karakter olmalı.', 'danger');
                return;
            }

            // Şifreyi güncelle
            aktifKullanici.sifre = yeniSifre;

            // localStorage'de kullanıcıyı güncelle
            let kullanicilar = JSON.parse(localStorage.getItem('kullanicilar')) || [];
            const index = kullanicilar.findIndex(kullanici => kullanici.kullaniciAdi === aktifKullanici.kullaniciAdi);

            if (index !== -1) {
                kullanicilar[index] = aktifKullanici;
                localStorage.setItem('kullanicilar', JSON.stringify(kullanicilar));
            }

            // Aktif kullanıcıyı güncelle
            localStorage.setItem('aktifKullanici', JSON.stringify(aktifKullanici));

            mesajGoster('Şifreniz başarıyla güncellendi.', 'success');
            sifreDegistirForm.reset();
        });
    }

    // Mesaj gösterim fonksiyonu
    function mesajGoster(mesaj, tip = 'success') {
        const mesajKutusu = document.createElement('div');
        mesajKutusu.className = `alert alert-${tip}`;
        mesajKutusu.textContent = mesaj;

        document.body.prepend(mesajKutusu);
        setTimeout(() => mesajKutusu.remove(), 3000);
    }
});
