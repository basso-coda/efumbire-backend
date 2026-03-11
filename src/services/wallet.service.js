const walletNumberGenerator = require('../utils/walletNumberGenerator');
const AgriculteurWallet = require('../db/models/gestion_paiements/AgriculteurWallet');

async function generateUniqueWalletNumber() {

    let walletNumber;
    let exists = true;

    while (exists) {

        walletNumber = walletNumberGenerator();

        const wallet = await AgriculteurWallet.findOne({
            where: { wallet_number: walletNumber }
        });

        if (!wallet) {
            exists = false;
        }
    }

    return walletNumber;
}

module.exports = {
    generateUniqueWalletNumber
};