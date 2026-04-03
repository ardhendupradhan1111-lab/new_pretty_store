const twilio = require('twilio');

let client;

const getClient = () => {
  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return client;
};

exports.sendOTPSMS = async (phone, otp) => {
  try {
    const twilioClient = getClient();
    
    // Ensure phone number has country code
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    await twilioClient.messages.create({
      body: `Your Pretty Store OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes. Do not share this OTP.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
    
    return { success: true };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    // In development, log OTP to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 DEV MODE - OTP for ${phone}: ${otp}`);
      return { success: true, devMode: true };
    }
    throw new Error('Failed to send OTP. Please try again.');
  }
};
