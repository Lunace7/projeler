// === Navbar Aktiflik ===
// Hangi sayfanın aktif olduğunu vurgular
function navbarAktiflik() {
    const navLinks = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname;

    navLinks.forEach((link) => {
        if (currentPage.includes(link.getAttribute('href'))) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// === Oturum Kontrolü ===
// Kullanıcının oturum açıp açmadığını kontrol eder ve navbarı günceller
function oturumKontrol() {
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    const sayfaAdi = window.location.pathname.split('/').pop();

    // Navbar elemanlarını al
    const gelirGiderLink = document.getElementById('gelirGiderLink');
    const navBar = document.querySelector('.navbar-nav.ms-auto');

    if (aktifKullanici) {
        // Oturum açılmışsa "Gelir-Gider" bağlantısını göster
        if (gelirGiderLink) gelirGiderLink.style.display = 'inline';

        // Navbar'a dinamik kullanıcı bilgisi ekle
        if (navBar) {
            navBar.innerHTML = `
                <li class="nav-item">
                    <a id="navKullaniciAdi" href="kullanici-panel.html" class="nav-link">${aktifKullanici.adSoyad || "Kullanıcı"}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="cikisYap()">Çıkış Yap</a>
                </li>
            `;
        }
    } else {
        // Oturum açılmamışsa "Gelir-Gider" bağlantısını gizle
        if (gelirGiderLink) gelirGiderLink.style.display = 'none';

        // Navbar "Giriş Yap" ve "Kayıt Ol" seçenekleri
        if (navBar) {
            navBar.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="giris.html">Giriş Yap</a></li>
                <li class="nav-item"><a class="nav-link" href="kayit.html">Kayıt Ol</a></li>
            `;
        }
    }

    // Korumalı sayfaların kontrolü
    const herkeseAcikSayfalar = ['index.html', 'hizmetler.html', 'hakkinda.html', 'iletisim.html'];
    if (!aktifKullanici && !herkeseAcikSayfalar.includes(sayfaAdi)) {
        alert('Bu sayfaya erişmek için giriş yapmanız gerekiyor.');
        window.location.href = 'giris.html';
    }
}

// === Çıkış Yap ===
// Kullanıcı oturumunu sonlandırır ve giriş sayfasına yönlendirir
function cikisYap() {
    localStorage.removeItem('aktifKullanici');
    mesajGoster('Başarıyla çıkış yaptınız.', 'success');
    setTimeout(() => {
        window.location.href = 'giris.html';
    }, 1000);
}

// === Dinamik Mesaj Göster ===
// Başarı veya hata mesajlarını ekranda gösterir
function mesajGoster(mesaj, tip = "success") {
    const mesajKutusu = document.createElement("div");
    mesajKutusu.className = `alert alert-${tip}`;
    mesajKutusu.textContent = mesaj;
    mesajKutusu.style.position = 'fixed';
    mesajKutusu.style.top = '10px';
    mesajKutusu.style.left = '50%';
    mesajKutusu.style.transform = 'translateX(-50%)';
    mesajKutusu.style.zIndex = '9999';

    document.body.appendChild(mesajKutusu);

    setTimeout(() => {
        mesajKutusu.remove();
    }, 3000);
}

// === İletişim Formu Gönderimi ===
// Sahte gönderildi mesajı
function iletisimMesajiGoster() {
    const iletisimForm = document.getElementById('iletisimForm');
    if (iletisimForm) {
        iletisimForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Formun varsayılan gönderim davranışını durdur
            mesajGoster('Mesajınız başarıyla gönderildi!', 'success'); // Başarı mesajını göster
        });
    }
}

// === Sayfa Yükleme ===
// Tüm fonksiyonları başlangıçta çağırır
document.addEventListener("DOMContentLoaded", () => {
    navbarAktiflik();   // Aktif sayfayı vurgula
    oturumKontrol();    // Kullanıcı oturum kontrolü
    iletisimMesajiGoster(); // İletişim formunu dinle
    console.log("Sayfa yüklendi ve tüm fonksiyonlar çalıştırıldı.");
});
