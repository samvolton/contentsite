import React from 'react';
import './Hakkimizda.css';

function Hakkimizda() {
  const paymentMethods = [
    { method: "IBAN ile ödeme", details: "1 Aylık 350 TL / 2 Aylık 600 TL / 6 Aylık 1700 TL" },
    { method: "Papara ödeme", details: "1 Aylık 350 TL / 2 Aylık 600 TL (Papara No: 1909220667) Para gönderirken Açıklamaya hiçbir şey yazmayın!" },
    { method: "Kart ile Ödeme", details: "Buraya tıklayın ve Patreon sayfamıza gidin. Genellikle Kredi Kartı ister. Fiyatı 14 Dolardır." }
  ];

  const warnings = [
    "İndirim felan diye boşuna ağlamayın. Mart 1 itibariyle şirketleşti burası.",
    "Özelden video gönder, sadece şu videoyu izlicem vb gibi şeylerle de gelmeyin.",
    "Boşuna dekont göndermeyin. Para hesaba düşmezse, VIP veremez.",
    "Havale EFT konularında saate dikkat edin. Para ertesi gün düşerse, ertesi gün VIP olursun.",
    "Sitede çalışmayan veya donan video yoktur. Hepsinin görseli içerisindeki videodan alıntıdır.",
    "Canlı Desteğe boş işler için gelmeyin. Direkt engelleyin talimatı verdim.",
    "Lütfen saygılı olun. Yoksa eliniz sikinizde bakarsınız resimlere."
  ];

  return (
    <div className="hakkimizda">
      <h1>Hakkımızda</h1>
      <p>Bu videoyu VIP üyelerimiz izleyebilir.</p>
      <p>Videoyu izlemek istiyorsanız, VIP üyelik satın almalısınız!</p>
      <a href="/premium" className="cta-button">OKU burayı OKU</a>
      <p>VIP üye olmak çok kolay. Önce <a href="/register" className="highlight">buraya tıklayarak</a> siteye üye ol, ardından ödeme yap. VIP üyeliğin aktif olsun.</p>
      
      <h2>VIP üyelik ödeme yöntemleri</h2>
      <ul>
        {paymentMethods.map((payment, index) => (
          <li key={index}><strong>{payment.method} –</strong> {payment.details}</li>
        ))}
      </ul>
      <p>Ödeme yaparken kullandığınız isim ve email, bu sitedekiyle aynı olsun. Olsun ki beklemeyin.</p>
      
      <h2>Neden VIP üyelik satın almalısın?</h2>
      <p><strong>Değerli Gençler:</strong> aldın kızı gittin StarBucks’a 2 kahve 1 kek 350 TL. Kız story atmaktan seninle ilgilenmedi bile...</p>
      <p><strong>Değerli Dayılar:</strong> namazdan çıktın mümin arkadaşlarınla Paşa Döner’e gittin. 3 tavuk menü 350 TL...</p>
      <p><strong>Değerli Hanımefendiler:</strong> bal ceviz vs. kocanı diriltmek için 500 TL ödüyorsun...</p>
      
      <h2>Bir kaç uyarı</h2>
      <ul>
        {warnings.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
      
      <p>Herhangi sorun sıkıntı durumunda, bu sitede sol altta bulunan Canlı Destek hattından bize ulaşın veya <a href="mailto:xloveitcom@gmail.com">xloveitcom@gmail.com</a> adresinden bize ulaşın. Kimsenin hakkı kimsede kalmaz. En kısa sürede VIP üyeliğiniz aktif olur.</p>
      
      <h2>Sistem nasıl işliyor?</h2>
      <p>Bu siteye üye oluyorsun. Üye olduğun email ile kartla veya papara ile ödeme yapıyorsun. Buradaki üyeliğine VIP tanımlıyorum. Tüm videoları sınırsızca izliyorsun. Gayet basit.</p>
    </div>
  );
}

export default Hakkimizda;
