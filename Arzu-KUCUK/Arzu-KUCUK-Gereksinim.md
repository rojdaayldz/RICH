ARZU'NUN GEREKSİNİMLERİ

1. Kullanıcı Kayıt

API Metodu: POST /auth/register

Açıklama: Kullanıcının ad, soyad, e-posta ve şifre bilgilerini girerek sisteme yeni hesap oluşturmasını sağlar. Girilen bilgiler doğrulandıktan sonra veritabanına kaydedilir. Aynı e-posta ile ikinci kayıt oluşturulamaz.

2. Hesap Silme

API Metodu: DELETE /users/{userId}

Açıklama: Kullanıcının hesabını sistemden kalıcı olarak silmesini sağlar. Bu işlem geri alınamaz ve kullanıcıya ait adres, favori ve sepet bilgileri de silinir. İşlem için kullanıcının giriş yapmış olması gerekir.

3. Giriş Yapma

API Metodu: POST /auth/login

Açıklama: Kullanıcının e-posta ve şifre bilgilerini girerek sisteme erişmesini sağlar. Bilgiler doğru ise kullanıcı için oturum (session/token) oluşturulur.

4. Çıkış Yapma

API Metodu: POST /auth/logout

Açıklama: Kullanıcının aktif oturumunu sonlandırmasını sağlar. Kullanıcı sistemden güvenli şekilde çıkış yapar ve oturum bilgileri geçersiz hale getirilir.

5. Kadın Ürünleri Listeleme

API Metodu: GET /products?category=kadin

Açıklama: Kadın kategorisine ait ürünlerin listelenmesini sağlar. Ürün adı, fiyat, stok bilgisi ve görsel bilgileri kullanıcıya gösterilir.

6. Erkek Ürünleri Listeleme

API Metodu: GET /products?category=erkek

Açıklama: Erkek kategorisine ait ürünlerin listelenmesini sağlar.

7. Bebek Ürünleri Listeleme

API Metodu: GET /products?category=bebek

Açıklama: Bebek kategorisine ait ürünlerin listelenmesini sağlar.

8. Aksesuar Ürünleri Listeleme

API Metodu: GET /products?category=aksesuar

Açıklama: Aksesuar kategorisine ait ürünlerin listelenmesini sağlar.