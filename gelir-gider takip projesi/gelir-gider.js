document.addEventListener('DOMContentLoaded', () => {
    // Oturum kontrolü
    aktifKullaniciyiKontrolEt();

    // Varsayılan kategori yüklemesi
    kategorileriYukle('Gelir');

    // Gelir-Gider formunu dinle
    const gelirGiderForm = document.getElementById('gelirGiderForm');
    if (gelirGiderForm) {
        gelirGiderForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (gelirGiderForm.dataset.mode === 'edit') {
                guncelleIslem(parseInt(gelirGiderForm.dataset.index));
            } else {
                yeniIslemEkle();
            }
        });
    }

    // Tür değiştiğinde kategori güncelle
    const turSelect = document.getElementById('tur');
    if (turSelect) {
        turSelect.addEventListener('change', function () {
            kategorileriYukle(this.value);
        });
    }

    // İşlemleri ve grafikleri yükle
    islemleriGoster();
    gelirGiderGrafikleriOlustur();
});

// === Oturum Kontrolü ===
function aktifKullaniciyiKontrolEt() {
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    if (!aktifKullanici) {
        alert('Lütfen giriş yapınız.');
        window.location.href = 'giris.html';
    }
}

// Kategorileri Yükle
function kategorileriYukle(tur) {
    const kategoriSelect = document.getElementById('kategori');
    kategoriSelect.innerHTML = ''; // Var olan seçenekleri temizle
    const secenekler = tur === 'Gelir'
        ? ['Maaş', 'Yatırım', 'Ek Gelir']
        : ['Gıda', 'Fatura', 'Ulaşım', 'Eğlence'];
    secenekler.forEach(sec => {
        const option = document.createElement('option');
        option.value = sec;
        option.textContent = sec;
        kategoriSelect.appendChild(option);
    });
}

// Yeni İşlem Ekle
function yeniIslemEkle() {
    const tarih = document.getElementById('tarih').value;
    const kategori = document.getElementById('kategori').value;
    const miktar = parseFloat(document.getElementById('miktar').value);
    const tur = document.getElementById('tur').value;

    if (!tarih || !kategori || isNaN(miktar) || miktar <= 0) {
        mesajGoster('Lütfen tüm alanları doldurun ve geçerli bir miktar girin.', 'danger');
        return;
    }

    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    if (!aktifKullanici) {
        mesajGoster('Oturum açık değil. Lütfen giriş yapın.', 'danger');
        return;
    }

    const islemler = JSON.parse(localStorage.getItem('islemler')) || [];
    const yeniIslem = {
        tarih,
        kategori,
        miktar,
        tur,
        kullanici: aktifKullanici.kullaniciAdi
    };

    islemler.push(yeniIslem);
    localStorage.setItem('islemler', JSON.stringify(islemler));

    mesajGoster('İşlem başarıyla eklendi.', 'success');
    document.getElementById('gelirGiderForm').reset();
    gelirGiderForm.dataset.mode = 'add';
    islemleriGoster();
    gelirGiderGrafikleriOlustur();
}

// Grafiklerin Oluşturulması
function gelirGiderGrafikleriOlustur() {
    const islemler = JSON.parse(localStorage.getItem('islemler')) || [];
    const gelirler = islemler.filter(islem => islem.tur === 'Gelir');
    const giderler = islemler.filter(islem => islem.tur === 'Gider');

    const toplamGelir = gelirler.reduce((toplam, islem) => toplam + islem.miktar, 0);
    const toplamGider = giderler.reduce((toplam, islem) => toplam + islem.miktar, 0);

    if (!gelirler.length && !giderler.length) {
    const grafikAlanı = document.getElementById('grafikAlanı');
    grafikAlanı.innerHTML = "<p>Gösterilecek veri bulunamadı.</p>";
    return;
}


    // Gelir-Gider Toplam Grafiği
    const toplamCanvas = document.getElementById('gelirGiderGrafik');
    if (toplamCanvas) {
        const context = toplamCanvas.getContext('2d');
        if (window.toplamChart) window.toplamChart.destroy();
        window.toplamChart = new Chart(context, {
            type: 'pie',
            data: {
                labels: ['Gelir', 'Gider'],
                datasets: [{
                    data: [toplamGelir, toplamGider],
                    backgroundColor: ['#28a745', '#dc3545']
                }]
            }
        });
    }

    // Gelir Grafiği
    const gelirCanvas = document.getElementById('gelirGrafik');
    if (gelirCanvas) {
        const context = gelirCanvas.getContext('2d');
        if (window.gelirChart) window.gelirChart.destroy();
        window.gelirChart = new Chart(context, {
            type: 'doughnut',
            data: {
                labels: gelirler.map(islem => islem.kategori),
                datasets: [{
                    data: gelirler.map(islem => islem.miktar),
                    backgroundColor: ['#D633FF', '#17a2b8', '#ffc107', '#20c997']
                }]
            }
        });
    }

    // Gider Grafiği
    const giderCanvas = document.getElementById('giderGrafik');
    if (giderCanvas) {
        const context = giderCanvas.getContext('2d');
        if (window.giderChart) window.giderChart.destroy();
        window.giderChart = new Chart(context, {
            type: 'doughnut',
            data: {
                labels: giderler.map(islem => islem.kategori),
                datasets: [{
                    data: giderler.map(islem => islem.miktar),
                    backgroundColor: ['#FF33A6', '#6c757d', '#20c997', '#ffc107']
                }]
            }
        });
    }
}

// İşlemleri Listele
function islemleriGoster() {
    const tablo = document.getElementById('gelirGiderTablosu');
    tablo.innerHTML = '';
    const islemler = JSON.parse(localStorage.getItem('islemler')) || [];
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));
    if (!aktifKullanici) return;

    const kullaniciIslemleri = islemler.filter(islem => islem.kullanici === aktifKullanici.kullaniciAdi);
    kullaniciIslemleri.forEach((islem, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${islem.tarih}</td>
            <td>${islem.kategori}</td>
            <td>${islem.miktar.toFixed(2)} TL</td>
            <td>${islem.tur}</td>
            <td>
                <button onclick="duzenleIslem(${index})" class="btn btn-warning btn-sm">Düzenle</button>
                <button onclick="islemSil(${index})" class="btn btn-danger btn-sm">Sil</button>
            </td>
        `;
        tablo.appendChild(tr);
    });
}

// İşlem Düzenle
function duzenleIslem(index) {
    const islemler = JSON.parse(localStorage.getItem('islemler'));
    const islem = islemler[index];
    document.getElementById('tarih').value = islem.tarih;
    document.getElementById('kategori').value = islem.kategori;
    document.getElementById('miktar').value = islem.miktar;
    document.getElementById('tur').value = islem.tur;

    const gelirGiderForm = document.getElementById('gelirGiderForm');
    gelirGiderForm.dataset.mode = 'edit';
    gelirGiderForm.dataset.index = index;
    document.getElementById('formBaslik').textContent = "Gelir/Gider Güncelle";
    document.querySelector('#gelirGiderForm button').textContent = "Güncelle";

}

// İşlem Güncelleme
function guncelleIslem(index) {
    const tarih = document.getElementById('tarih').value;
    const kategori = document.getElementById('kategori').value;
    const miktar = parseFloat(document.getElementById('miktar').value);
    const tur = document.getElementById('tur').value;

    if (!tarih || !kategori || isNaN(miktar) || miktar <= 0) {
        mesajGoster('Lütfen tüm alanları doldurun ve geçerli bir miktar girin.', 'danger');
        return;
    }

    const islemler = JSON.parse(localStorage.getItem('islemler'));
    const aktifKullanici = JSON.parse(localStorage.getItem('aktifKullanici'));

    if (!aktifKullanici) {
        mesajGoster('Oturum açık değil. Lütfen giriş yapın.', 'danger');
        return;
    }

    const guncellenenIslem = {
        tarih,
        kategori,
        miktar,
        tur,
        kullanici: aktifKullanici.kullaniciAdi
    };

    islemler[index] = guncellenenIslem;
    localStorage.setItem('islemler', JSON.stringify(islemler));

    mesajGoster('İşlem başarıyla güncellendi.', 'success');
    document.getElementById('gelirGiderForm').reset();
    document.getElementById('gelirGiderForm').dataset.mode = 'add';
    islemleriGoster();
    // Formu sıfırla ve buton başlığını "Ekle" olarak değiştir
document.getElementById('gelirGiderForm').reset();
document.getElementById('gelirGiderForm').dataset.mode = 'add';
document.getElementById('formBaslik').textContent = "Gelir/Gider Ekle";
document.querySelector('#gelirGiderForm button').textContent = "Ekle";

mesajGoster('İşlem başarıyla güncellendi.', 'success');
    gelirGiderGrafikleriOlustur();
}

// İşlem Sil
function islemSil(index) {
    const islemler = JSON.parse(localStorage.getItem('islemler')) || [];
    islemler.splice(index, 1);
    localStorage.setItem('islemler', JSON.stringify(islemler));
    mesajGoster('İşlem silindi.', 'success');
    islemleriGoster();
    gelirGiderGrafikleriOlustur();
}

// Mesaj Göster
function mesajGoster(mesaj, tip = 'success') {
    const mesajKutusu = document.createElement('div');
    mesajKutusu.className = `alert alert-${tip}`;
    mesajKutusu.textContent = mesaj;
    mesajKutusu.style.position = 'fixed';
    mesajKutusu.style.top = '10px';
    mesajKutusu.style.left = '50%';
    mesajKutusu.style.transform = 'translateX(-50%)';
    mesajKutusu.style.zIndex = '9999';
    document.body.appendChild(mesajKutusu);
    setTimeout(() => mesajKutusu.remove(), 3000);
}
