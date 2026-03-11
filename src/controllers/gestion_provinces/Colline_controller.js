const yup = require('yup')
const { ValidationError } = require('sequelize')
const Colline = require('../../db/models/gestion_provinces/Colline');
const Zone = require('../../db/models/gestion_provinces/Zone');

/**
 * Recupérer la liste des collines
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getCollines = async (req, res) => {
    try {
        const { rows = 10, first = 0, sortField, sortOrder, search, zone} = req.query

        const defaultSortField = "COLLINE_ID"
        const defaultSortDirection = "DESC"
        const sortColumns = {
          collines: {
            as: "collines",
            fields: {
                COLLINE_ID: "COLLINE_ID",
                COLLINE_NAME: "COLLINE_NAME",
                ZONE_ID: "ZONE_ID",
                LATITUDE: "LATITUDE",
                LONGITUDE: "LONGITUDE"
            }
          },
        }
        var orderColumn, orderDirection
        // sorting
        var sortModel
        if (sortField) {
          for (let key in sortColumns) {
            if (sortColumns[key].fields.hasOwnProperty(sortField)) {
              sortModel = {
                model: key,
                as: sortColumns[key].as
              }
              orderColumn = sortColumns[key].fields[sortField]
              break
            }
          }
        }
        if (!orderColumn || !sortModel) {
          orderColumn = sortColumns.collines.fields.COLLINE_ID
          sortModel = {
            model: 'collines',
            as: sortColumns.collines
          }
        }
        // ordering
        if (sortOrder == 1) {
          orderDirection = 'ASC'
        } else if (sortOrder == -1) {
          orderDirection = 'DESC'
        } else {
          orderDirection = defaultSortDirection
        }

        // searching
        const globalSearchColumns = [
          'COLLINE_NAME',
          'ZONE_ID',
          'LATITUDE',
          'LONGITUDE',
          '$zones.ZONE_NAME$',

        ]
        var globalSearchWhereLike = {}
        if (search && search.trim() != "") {
          const searchWildCard = {}
          globalSearchColumns.forEach(column => {
            searchWildCard[column] = {
              [Op.substring]: search
            }
          })
          globalSearchWhereLike = {
            [Op.or]: searchWildCard
          }
        }

        //filtre par type_partenaire
        var filtrezone={}
        if(zone){
            filtrezone= {"$zones.ZONE_ID$":zone}
        }

        const collines = await Colline.findAndCountAll({
          limit: parseInt(rows),
          offset: parseInt(first),
          order: [
            [sortModel, orderColumn, orderDirection]
          ],
          where: {
            ...globalSearchWhereLike,
            ...filtrezone
          },
          include:
            {
              model: Zone,
              as: 'zones',
            }


        })

        res.status(200).json({
          message: "Liste des collines",
          totalRecords:collines.count,
          collines
        })
      } catch (error) {
        console.log(error)
        res.status(500).json({
          message: "Erreur interne du serveur, réessayer plus tard"
        })
      }
}

module.exports = {
    getCollines
}