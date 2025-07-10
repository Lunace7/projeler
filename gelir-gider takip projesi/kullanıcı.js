document.addEventListener('DOMContentLoaded', () => {
    // Formları seçelim
    const kayitForm = document.getElementById('kayitForm');
    const girisForm = document.getElementById('girisForm');
    const profilForm = document.getElementById('profilForm');

    // Kayıt Formu İşlemleri
    if (kayitForm) {
        kayitForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const adSoyad = document.getElementById('adSoyad').value.trim();
            const kullaniciAdi = document.getElementById('kullaniciAdi').value.trim();
            const email = document.getElementById('email').value.trim();
            const sifre = document.getElementById('sifre').value;
            const sifreOnay = document.getElementById('sifreOnay').value;

            if (!adSoyad || !kullaniciAdi || !email || !sifre || !sifreOnay) {
                mesajGoster('Lütfen tüm alanları doldurun.', 'danger');
                return;
            }

            if (sifre !== sifreOnay) {
                mesajGoster('Şifreler uyuşmuyor. Lütfen tekrar deneyin.', 'danger');
                return;
            }

            const mevcutKullanicilar = getKullanicilar();
            if (mevcutKullanicilar.some(kullanici =>
                kullanici.kullaniciAdi === kullaniciAdi || kullanici.email === email
            )) {
                mesajGoster('Bu kullanıcı adı veya e-posta zaten kayıtlı.', 'danger');
                return;
            }

            mevcutKullanicilar.push({ adSoyad, kullaniciAdi, email, sifre });
            setKullanicilar(mevcutKullanicilar);
            mesajGoster('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
            setTimeout(() => window.location.href = 'giris.html', 2000);
        });
    }

    // Giriş Formu İşlemleri
    if (girisForm) {
        girisForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const kullaniciAdiEmail = document.getElementById('kullaniciAdiEmail').value.trim();
            const sifre = document.getElementById('sifre').value;

            const kullanici = getKullanicilar().find(kullanici =>
                (kullanici.kullaniciAdi === kullaniciAdiEmail || kullanici.email === kullaniciAdiEmail) &&
                kullanici.sifre === sifre
            );

            if (kullanici) {
                mesajGoster('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                setAktifKullanici(kullanici);
                setTimeout(() => window.location.href = 'index.html', 2000);
            } else {
                mesajGoster('Kullanıcı adı/e-posta veya şifre hatalı.', 'danger');
            }
        });
    }

    // Profil Formu İşlemleri
    if (profilForm) {
        const mevcutKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
        if (mevcutKullanici) {
            document.getElementById('adSoyad').value = mevcutKullanici.adSoyad;
            document.getElementById('email').value = mevcutKullanici.email;

            profilForm.addEventListener('submit', (event) => {
                event.preventDefault();

                mevcutKullanici.adSoyad = document.getElementById('adSoyad').value.trim();
                mevcutKullanici.email = document.getElementById('email').value.trim();

                localStorage.setItem('aktifKullanici', JSON.stringify(mevcutKullanici));
                mesajGoster('Profil bilgileri güncellendi!', 'success');
            });
        } else {
            mesajGoster('Oturum açılmamış. Lütfen giriş yapın.', 'danger');
            setTimeout(() => window.location.href = 'giris.html', 2000);
        }
    }
});

// Mesaj Gösterimi
function mesajGoster(mesaj, tur = 'success') {
    const mesajKutusu = document.createElement('div');
    mesajKutusu.className = `alert alert-${tur}`;
    mesajKutusu.textContent = mesaj;

    document.body.prepend(mesajKutusu);
    setTimeout(() => mesajKutusu.remove(), 3000);
}

// LocalStorage İşlemleri
function getKullanicilar() {
    return JSON.parse(localStorage.getItem('kullanicilar')) || [];
}

function setKullanicilar(kullanicilar) {
    localStorage.setItem('kullanicilar', JSON.stringify(kullanicilar));
}

function setAktifKullanici(kullanici) {
    localStorage.setItem('aktifKullanici', JSON.stringify(kullanici));
}
