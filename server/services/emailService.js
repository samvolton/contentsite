// server/services/emailService.js
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const config = require('../config');

console.log('Loading emailService.js');
console.log('MAILGUN_API_KEY:', config.mailgunApiKey ? 'Set' : 'Not set');
console.log('MAILGUN_DOMAIN:', config.mailgunDomain);

if (!config.mailgunApiKey) {
  console.error('MAILGUN_API_KEY is not defined in environment variables');
  process.exit(1);
}

if (!config.mailgunDomain) {
  console.error('MAILGUN_DOMAIN is not defined in environment variables');
  process.exit(1);
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: config.mailgunApiKey,
});

const sendVerificationEmail = async (email, verificationToken, amount) => {
  console.log('Preparing to send verification email');
  console.log('Email:', email);
  console.log('Amount:', amount);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

  const verificationLink = `${process.env.FRONTEND_URL}/register?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;
  console.log('Verification link:', verificationLink);

  const data = {
    from: 'Nude Cenneti <noreply@yourcompany.com>',
    to: email,
    subject: 'Ödemenizi Tamamlayın ve Hesabınızı Oluşturun',
    html: `
      <h2>Premium içeriğimize gösterdiğiniz ilgi için teşekkür ederiz!</h2>
      <p>${amount} TRY tutarında bir ödeme başlattınız.</p>
      <p>Lütfen aşağıdaki adımları takip edin:</p>
      <ol>
        <li>${amount} TRY tutarında bir banka havalesi yapın:</li>
        <li>Papara Hesap Numarası: 1982400478</li>
        <li>Hesap IBAN Numarası: TR39 0082 9000 0949 1982 4004 78</li>
        <li>Ödemeyi yaptıktan sonra, lütfen bu e-postayı yanıtlayarak ödeme onayınızı gönderin.</li>
        <li>Ödemenizi doğruladıktan sonra, size bir onay e-postası göndereceğiz.</li>
        <li>Onay e-postasını aldıktan sonra, aşağıdaki bağlantıyı kullanarak hesabınızı oluşturabilirsiniz:</li>
      </ol>
      <a href="${verificationLink}">Hesap Oluştur</a>
      <p>Hesabınızı oluşturduktan sonra premium içeriğe erişebileceksiniz.</p>
      <p>Herhangi bir sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.</p>
    `
  };

  console.log('Email data prepared:', data);

  try {
    const result = await mg.messages.create(config.mailgunDomain, data);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Check if the error is due to unauthorized recipient
    if (error.status === 400 && error.details && error.details.includes("not on your authorized recipient list")) {
      console.log('Unauthorized recipient. For testing, logging email content instead of sending:');
      console.log(data);
      return { message: 'Email logged for testing (unauthorized recipient)' };
    }
    
    throw error;
  }
};

const sendPaymentConfirmationEmail = async (email, verificationToken) => {
  console.log('Preparing to send payment confirmation email');
  console.log('Email:', email);

  const verificationLink = `${process.env.FRONTEND_URL}/register?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;
  console.log('Verification link:', verificationLink);

  const data = {
    from: 'Nude Cenneti <noreply@yourcompany.com>',
    to: email,
    subject: 'Ödemeniz Onaylandı - Hesabınızı Oluşturun',
    html: `
      <h2>Ödemeniz başarıyla onaylandı!</h2>
      <p>Artık hesabınızı oluşturabilir ve premium içeriğe erişebilirsiniz.</p>
      <p>Hesabınızı oluşturmak için lütfen aşağıdaki bağlantıya tıklayın:</p>
      <a href="${verificationLink}">Hesap Oluştur</a>
      <p>Herhangi bir sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.</p>
    `
  };

  console.log('Email data prepared:', data);

  try {
    const result = await mg.messages.create(config.mailgunDomain, data);
    console.log('Payment confirmation email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Check if the error is due to unauthorized recipient
    if (error.status === 400 && error.details && error.details.includes("not on your authorized recipient list")) {
      console.log('Unauthorized recipient. For testing, logging email content instead of sending:');
      console.log(data);
      return { message: 'Email logged for testing (unauthorized recipient)' };
    }
    
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPaymentConfirmationEmail
};