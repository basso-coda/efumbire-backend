const { sequelize } = require("../../db/models");
const Colline = require("../../db/models/gestion_provinces/Colline");
const Stock = require('../../db/models/gestion_stocks/Stock');
const TypeEngrais = require("../../db/models/gestion_terrains/TypeEngrais");

const getStocks = async (req, res) => {
    try {

        const { rows = 10, first = 0, sortField, sortOrder, search } = req.query;

        const defaultSortDirection = "DESC";

        // ===== SORT CONFIG =====
        const sortColumns = {
            commandes: {
                as: "stock",
                fields: {
                    id_commande: "id_stock",
                    quantite_disponible: "quantite_disponible",
                    type_engrais_id: "type_engrais_id",
                    colline_id: "colline_id"
                }
            }
        };

        let orderColumn, orderDirection;
        let sortModel;

        if (sortField) {
            for (let key in sortColumns) {
                if (sortColumns[key].fields.hasOwnProperty(sortField)) {
                    sortModel = {
                        model: key,
                        as: sortColumns[key].as
                    };

                    orderColumn = sortColumns[key].fields[sortField];
                    break;
                }
            }
        }

        if (!orderColumn) {
            orderColumn = "id_stock";
        }

        // ===== ORDER =====
        if (sortOrder == 1) {
            orderDirection = "ASC";
        } else if (sortOrder == -1) {
            orderDirection = "DESC";
        } else {
            orderDirection = defaultSortDirection;
        }

        // ===== QUERY =====
        const data = await Stock.findAndCountAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            order: [[orderColumn, orderDirection]],
            distinct: true,
            subQuery: false,

            include: [
                {
                    model: TypeEngrais,
                    as: "type_engrais",
                },
                {
                    model: Colline,
                    as: "colline",
                },
                
            ]
        });

        return res.json({
            httpStatus: 200,
            message: "Stock récupéré avec succès",
            data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            httpStatus: 500,
            message: error.message,
            data: null
        });
    }
};

const getStockByColline = async (req, res) => {
    try {

        const { colline_id } = req.query;

        const where = {};

        if (colline_id) {
            where.colline_id = colline_id;
        }

        const stocks = await Stock.findAll({
            where,
            include: [
                {
                    model: TypeEngrais,
                    as: 'type_engrais'
                },
                {
                    model: Colline,
                    as: 'colline'
                }
            ],
            order: [['updated_date', 'DESC']]
        });

        return res.json({
            httpStatus: 200,
            message: "Stock récupéré avec succès",
            data: stocks
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            httpStatus: 500,
            message: error.message
        });
    }
};

module.exports = {
    getStocks,
    getStockByColline
}