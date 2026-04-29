const voucherCodeGenerator = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "VCH-";

    for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
};

module.exports = voucherCodeGenerator;