using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;

namespace TrafikCezasiApp
{
    public class Driver
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string TCKN { get; set; }
        public string PlateNumber { get; set; }
        public List<TrafficFine> Fines { get; set; } = new List<TrafficFine>();
    }

    public class TrafficFine
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public bool IsPaid { get; set; }
    }

    class Program
    {
        static void Main(string[]args)
        {
            CreateDatabase();

            Console.WriteLine("--- Trafik Cezası Sorgulama Sistemi ---\n");

            while (true)
            {
                Console.WriteLine("1. Kayıt Ol");
                Console.WriteLine("2. Giriş Yap (Sürücü)");
                Console.WriteLine("3. Giriş Yap (Admin)");
                Console.WriteLine("4. Çıkış");
                Console.Write("Seçiminiz: ");
                string secim = Console.ReadLine();

                switch (secim)
                {
                    case "1":
                        KayitOl();
                        break;
                    case "2":
                        var kullanici = GirisYap();
                        if (kullanici != null)
                        {
                            Console.WriteLine($"\nHoş geldin {kullanici.FullName}!");
                            KullaniciMenusu(kullanici);
                        }
                        break;
                    case "3":
                        AdminGiris();
                        break;
                    case "4":
                        return;
                    default:
                        Console.WriteLine("Geçersiz seçim.");
                        break;
                }
            }
        }
        static void AdminGiris()
        {
            Console.Write("Admin kullanıcı adı: ");
            string kullaniciAdi = Console.ReadLine();

            Console.Write("Şifre: ");
            string sifre = ReadPassword();


            if (kullaniciAdi == "admin" && sifre == "1234")
            {
                Console.WriteLine("Admin girişi başarılı!");
                AdminMenusu();
            }
            else
            {
                Console.WriteLine("Hatalı admin bilgileri.");
            }
        }

        static void AdminMenusu()
        {
            while (true)
            {
                Console.WriteLine("\n*** Admin Menüsü ***");
                Console.WriteLine("1. Tüm Sürücüleri Listele");
                Console.WriteLine("2. Sürücüye Ceza Ekle");
                Console.WriteLine("3. Çıkış");
                Console.Write("Seçim: ");
                string secim = Console.ReadLine();

                switch (secim)
                {
                    case "1":
                        TumSuruculeriListele();
                        break;
                    case "2":
                        SurucuyaCezaEkle();
                        break;
                    case "3":
                        return;
                    default:
                        Console.WriteLine("Geçersiz seçim.");
                        break;
                }
            }
        }
        static void SurucuyaCezaEkle()
        {
            Console.Write("Ceza eklenecek sürücünün plaka numarasını girin: ");
            string plaka = Console.ReadLine();

            using var connection = new SQLiteConnection("Data Source=trafikcezasi.db");
            connection.Open();

            var selectCmd = connection.CreateCommand();
            selectCmd.CommandText = "SELECT Id, FullName FROM Drivers WHERE PlateNumber = $plaka";
            selectCmd.Parameters.AddWithValue("$plaka", plaka);

            using var reader = selectCmd.ExecuteReader();
            if (!reader.Read())
            {
                Console.WriteLine("Bu plaka ile eşleşen bir kullanıcı bulunamadı.");
                return;
            }

            int driverId = reader.GetInt32(0);
            string fullName = reader.GetString(1);

            Console.WriteLine($"Kullanıcı bulundu: {fullName}");
            Console.WriteLine("\nCeza Türünü Seçin:");
            for (int i = 0; i < CezaTurleri.Count; i++)
            {
                Console.WriteLine($"{i + 1}. {CezaTurleri[i]}");
            }

            Console.Write("Seçiminiz: ");
            if (!int.TryParse(Console.ReadLine(), out int secim) || secim < 1 || secim > CezaTurleri.Count)
            {
                Console.WriteLine("Geçersiz ceza türü seçimi.");
                return;
            }

            string reason = CezaTurleri[secim - 1];

            Console.Write("Ceza Tutarı: ");
            if (!decimal.TryParse(Console.ReadLine(), out decimal amount))
            {
                Console.WriteLine("Geçersiz tutar.");
                return;
            }

            DateTime date = DateTime.Now;

            var insertCmd = connection.CreateCommand();
            insertCmd.CommandText = @"
        INSERT INTO TrafficFines (DriverId, Reason, Amount, Date, IsPaid)
        VALUES ($driverId, $reason, $amount, $date, 0);
    ";
            insertCmd.Parameters.AddWithValue("$driverId", driverId);
            insertCmd.Parameters.AddWithValue("$reason", reason);
            insertCmd.Parameters.AddWithValue("$amount", amount);
            insertCmd.Parameters.AddWithValue("$date", date.ToString("yyyy-MM-dd"));

            int result = insertCmd.ExecuteNonQuery();
            if (result > 0)
                Console.WriteLine("Ceza başarıyla eklendi.");
            else
                Console.WriteLine("Ceza ekleme işlemi başarısız.");
        }

        static void TumSuruculeriListele()
        {
            using var connection = new SQLiteConnection("Data Source=trafikcezasi.db");
            connection.Open();

            var cmd = connection.CreateCommand();
            cmd.CommandText = "SELECT Id, FullName, TCKN, PlateNumber FROM Drivers";

            using var reader = cmd.ExecuteReader();
            Console.WriteLine("\n--- Sürücüler ---");
            while (reader.Read())
            {
                Console.WriteLine($"ID: {reader.GetInt32(0)} | Ad: {reader.GetString(1)} | TCKN: {reader.GetString(2)} | Plaka: {reader.GetString(3)}");
            }
        }

        static void KullaniciMenusu(Driver driver)
        {
            while (true)
            {
                Console.WriteLine("\n*** Kullanıcı Menüsü ***");
                Console.WriteLine("1. Cezaları Listele");
                Console.WriteLine("2. Ceza Öde"); 
                Console.WriteLine("3. Çıkış Yap");
                Console.Write("Seçim: ");
                string secim = Console.ReadLine();

                switch (secim)
                {
                    case "1":
                        ListeleCezalar(driver);
                        break;
                    case "2":
                        OdeCeza(driver);
                        break;
                    case "3":
                        return;
                    default:
                        Console.WriteLine("Geçersiz seçim.");
                        break;
                }
            }
        }

        static readonly List<string> CezaTurleri = new List<string>
        {
            "Hız sınırını aşmak",
            "Emniyet kemeri takmamak",
            "Kırmızı ışıkta geçmek",
            "Alkollü araç kullanmak",
            "Park yasağına uymamak",
            "Ehliyetsiz araç kullanmak",
            "Telefonla konuşarak araç kullanmak",
            "Trafik işaretlerine uymamak",
            "Sigortasız araç kullanmak",
            "Muayenesiz araç kullanmak"
        };

        static void CreateDatabase()
        {
            using var connection = new SQLiteConnection("Data Source=trafikcezasi.db");
            connection.Open();

            var tableCmd = connection.CreateCommand();
            tableCmd.CommandText = @"
                CREATE TABLE IF NOT EXISTS Drivers (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    FullName TEXT NOT NULL,
                    TCKN TEXT NOT NULL UNIQUE,
                    PlateNumber TEXT NOT NULL,
                    Password TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS TrafficFines (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    DriverId INTEGER NOT NULL,
                    Reason TEXT NOT NULL,
                    Amount REAL NOT NULL,
                    Date TEXT NOT NULL,
                    IsPaid INTEGER NOT NULL,
                    FOREIGN KEY (DriverId) REFERENCES Drivers(Id)
                );
            ";
            tableCmd.ExecuteNonQuery();
        }

        static void KayitOl()
        {
            Console.Write("Ad Soyad: ");
            string ad = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(ad))
            {
                Console.WriteLine("Ad Soyad boş olamaz.");
                return;
            }

            Console.Write("TC Kimlik No: ");
            string tckn = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(tckn) || tckn.Length != 11 || !tckn.All(char.IsDigit))
            {
                Console.WriteLine("Geçerli bir TC Kimlik No giriniz (11 haneli, sadece rakam).");
                return;
            }

            Console.Write("Plaka: ");
            string plaka = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(plaka) || plaka.Length < 5 || plaka.Length > 10)
            {
                Console.WriteLine("Geçerli bir plaka giriniz (5-10 karakter arası).");
                return;
            }

            Console.Write("Şifre: ");
            string sifre = ReadPassword();
            if (string.IsNullOrWhiteSpace(sifre))
            {
                Console.WriteLine("\nŞifre boş olamaz.");
                return;
            }

            using var connection = new SQLiteConnection("Data Source=trafikcezasi.db");
            connection.Open();

            var checkCmd = connection.CreateCommand();
            checkCmd.CommandText = "SELECT COUNT(*) FROM Drivers WHERE TCKN = $tckn";
            checkCmd.Parameters.AddWithValue("$tckn", tckn);
            long count = (long)checkCmd.ExecuteScalar();

            if (count > 0)
            {
                Console.WriteLine("Bu kullanıcı ile zaten kayıt var.");
                return;
            }

            var insertCmd = connection.CreateCommand();
            insertCmd.CommandText = @"
            INSERT INTO Drivers (FullName, TCKN, PlateNumber, Password)
            VALUES ($ad, $tckn, $plaka, $sifre);
            ";
            insertCmd.Parameters.AddWithValue("$ad", ad);
            insertCmd.Parameters.AddWithValue("$tckn", tckn);
            insertCmd.Parameters.AddWithValue("$plaka", plaka);
            insertCmd.Parameters.AddWithValue("$sifre", sifre);

            int result = insertCmd.ExecuteNonQuery();
            Console.WriteLine(result > 0 ? "Kayıt başarılı!" : "Kayıt sırasında hata oluştu.");
        }

        static Driver GirisYap()
        {
            Console.Write("TC Kimlik No: ");
            string tckn = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(tckn) || tckn.Length != 11 || !tckn.All(char.IsDigit))
            {
                Console.WriteLine("Geçerli bir TC Kimlik No giriniz (11 haneli, sadece rakam).");
                return null;
            }

            Console.Write("Şifre: ");
            string sifre = ReadPassword();
            if (string.IsNullOrWhiteSpace(sifre))
            {
                Console.WriteLine("\nŞifre boş olamaz.");
                return null;
            }

            using var connection = new SQLiteConnection("Data Source=trafikcezasi.db");
            connection.Open();

            var selectCmd = connection.CreateCommand();
            selectCmd.CommandText = "SELECT Id, FullName, TCKN, PlateNumber, Password FROM Drivers WHERE TCKN = $tckn AND Password = $sifre";
            selectCmd.Parameters.AddWithValue("$tckn", tckn);
            selectCmd.Parameters.AddWithValue("$sifre", sifre);

            using var reader = selectCmd.ExecuteReader();
            if (reader.Read())
            {
                var driver = new Driver
                {
                    Id = reader.GetInt32(0),
                    FullName = reader.GetString(1),
                    TCKN = reader.GetString(2),
                    PlateNumber = reader.GetString(3),
                    Fines = new List<TrafficFine>()
                };

                var finesCmd = connection.CreateCommand();
                finesCmd.CommandText = "SELECT Id, Reason, Amount, Date, IsPaid FROM TrafficFines WHERE DriverId = $driverId";
                finesCmd.Parameters.AddWithValue("$driverId", driver.Id);

                using var finesReader = finesCmd.ExecuteReader();
                while (finesReader.Read())
                {
                    driver.Fines.Add(new TrafficFine
                    {
                        Id = finesReader.GetInt32(0),
                        Reason = finesReader.GetString(1),
                        Amount = finesReader.GetDecimal(2),
                        Date = DateTime.Parse(finesReader.GetString(3)),
                        IsPaid = finesReader.GetInt32(4) == 1
                    });
                }

                return driver;
            }
            else
            {
                Console.WriteLine("Kullanıcı bulunamadı veya şifre yanlış.");
                return null;
            }
        }
        static string ReadPassword()
        {
            string password = "";
            ConsoleKeyInfo key;

            do
            {
                key = Console.ReadKey(intercept: true);
                if (key.Key == ConsoleKey.Backspace && password.Length > 0)
                {
                    password = password.Substring(0, password.Length - 1);
                    Console.Write("\b \b"); // karakteri sil
                }
                else if (!char.IsControl(key.KeyChar))
                {
                    password += key.KeyChar;
                    Console.Write("*");
                }
            } while (key.Key != ConsoleKey.Enter);
            Console.WriteLine();

            return password;
        }

        static void ListeleCezalar(Driver driver)
        {
            if (driver.Fines.Count == 0)
            {
                Console.WriteLine("Henüz cezanız bulunmamaktadır.");
                return;
            }

            Console.WriteLine($"\n{driver.FullName} adlı kullanıcıya ait cezalar:");
            for (int i = 0; i < driver.Fines.Count; i++)
            {
                var fine = driver.Fines[i];
                Console.WriteLine($"{i + 1}. {fine.Date.ToShortDateString()} - {fine.Reason} - {fine.Amount} TL - " +$"{(fine.IsPaid ? "ÖDENDİ" : "ÖDENMEDİ")}");
            }
        }

        static void OdeCeza(Driver driver)
        {
            ListeleCezalar(driver);
            if (driver.Fines.Count == 0)
                return;

            Console.Write("Ödemek istediğiniz cezanın numarasını girin: ");
            string input = Console.ReadLine();

            if (int.TryParse(input, out int index) && index >= 1 && index <= driver.Fines.Count)
            {
                var selected = driver.Fines[index - 1];
                if (selected.IsPaid)
                {
                    Console.WriteLine("Bu ceza zaten ödenmiş.");
                }
                else
                {
                    using var connection = new SQLiteConnection("Data Source=trafikcezasi.db");
                    connection.Open();

                    var updateCmd = connection.CreateCommand();
                    updateCmd.CommandText = "UPDATE TrafficFines SET IsPaid = 1 WHERE Id = $fineId";
                    updateCmd.Parameters.AddWithValue("$fineId", selected.Id);

                    int result = updateCmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        selected.IsPaid = true;
                        Console.WriteLine("Ceza başarıyla ödendi!");
                    }
                    else
                    {
                        Console.WriteLine("Ödeme işlemi sırasında hata oluştu.");
                    }
                }
            }
            else
            {
                Console.WriteLine("Geçersiz giriş.");
            }
        }
    }
}
