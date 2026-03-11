const Agriculteur = require('../db/models/gestion_agriculteurs/Agriculteur')
const Colline = require('../db/models/gestion_provinces/Colline')
const Commune = require('../db/models/gestion_provinces/Commune')
const Zone = require('../db/models/gestion_provinces/Zone')
const Province = require('../db/models/gestion_provinces/Province')

async function generateMatricule(colline_id, transaction) {
    // récupérer province
    const colline = await Colline.findByPk(colline_id, {
        include: {
            model: Zone,
            as: 'zones',
            include: {
                model: Commune,
                as: 'communes',
                include: {
                    model: Province,
                    as: 'provinces'
                }
            }
        },
        transaction
    });

    const provinceId = colline.zones.communes.provinces.PROVINCE_ID;

    // Format province 2 digits
    const provinceCode = provinceId.toString().padStart(2, '0');

    // Compte agriculteurs de cette province
    const count = await Agriculteur.count({
        include: {
            model: Colline,
            as: 'collines',
            include: {
                model: Zone,
                as: 'zones',
                include: {
                    model: Commune,
                    as: 'communes',
                    include: {
                        model: Province,
                        as: 'provinces'
                    }
                }
            }
        },
        where: {
            '$collines.zones.communes.provinces.PROVINCE_ID$': provinceId
        },
        transaction
    });

    const nextNumber = (count + 1).toString().padStart(4, '0');

    return `AG-${provinceCode}-${nextNumber}`;
}

module.exports = {
    generateMatricule
}