const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// Default payment methods doc
settingsSchema.statics.getPaymentMethods = async function() {
  let doc = await this.findOne({ key: 'paymentMethods' });
  if (!doc) {
    doc = await this.create({
      key: 'paymentMethods',
      value: { UPI: true, COD: true, Card: true, NetBanking: true }
    });
  }
  return doc.value;
};

module.exports = mongoose.model('Settings', settingsSchema);
