module.exports = function walletNumberGenerator() {
    const prefix = "WL";

    const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    const timestampPart = Date.now()
        .toString()
        .slice(-4);

    return `${prefix}${timestampPart}${randomPart}`;
};