const yup = require('yup');
const TypeEngrais = require('../../db/models/gestion_terrains/TypeEngrais');
const { ValidationError, Op } = require('sequelize');
const EngraisRecommandation = require('../../db/models/gestion_terrains/EngraisRecommandation');
const TypeCulture = require('../../db/models/gestion_terrains/TypeCulture');
const Saison = require('../../db/models/gestion_commandes/Saison');

/**
 * Recupérer la liste des recommandations d'engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getEngraisRecommandations = async (req, res) => {
    try {
        const { rows = 10, first = 0, sortField, sortOrder, search } = req.query

        const defaultSortDirection = "DESC"

        const sortColumns = {
            engrais_recommandations: {
                as: "engrais_recommandation",
                fields: {
                    id_agriculteur: "id_engrais_recommandations",
                    type_engrais_id: "type_engrais_id",
                    type_culture_id: "type_culture_id",
                    dose_par_hectare: "dose_par_hectare",
                    min_dose: "min_dose",
                    max_dose: "max_dose",
                    saison_id: "saison_id",
                    date_creation: "date_creation"
                }
            }
        }

        let orderColumn, orderDirection
        // sorting
        let sortModel

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
            orderColumn = sortColumns.engrais_recommandations.fields.id_engrais_recommandations

            sortModel = {
                model: 'engrais_recommandations',
                as: sortColumns.engrais_recommandations.as
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

        const globalSearchWhereLike = search && search.trim() !== ""
        ? {
            [Op.or]: [
                { dose_par_hectare: { [Op.substring]: search } },
            ]
            }
        : {};

        const data = await EngraisRecommandation.findAndCountAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            order: [[orderColumn, orderDirection]],
            // where: { ...globalSearchWhereLike, },
            where: globalSearchWhereLike,
            distinct: true,
            subQuery: false,
            include: [
                {
                    model: TypeEngrais,
                    as: 'type_engrais',
                    required: false,
                    where: search
                        ? {
                            nom_type_engrais: {
                                [Op.substring]: search
                            }
                        }
                        : undefined
                },
                {
                    model: TypeCulture,
                    as: 'type_culture',
                    required: false,
                    where: search
                        ? {
                            nom_type_culture: {
                                [Op.substring]: search
                            }
                        }
                        : undefined
                },
                {
                    model: Saison,
                    as: 'saison',
                    required: false,
                    where: search
                        ? {
                            intitule: {
                                [Op.substring]: search
                            }
                        }
                        : undefined
                },
            ]
        });

        res.json({
            httpStatus: 200,
            message: `Recommandations d'engrais recupérés avec succès`,
            data
        });
    } catch (error) {
        console.error(error);

        res.json({
            // message: 'Erreur interne du serveur',
            message: error.message,
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Créer une nouvelle recommandation d'engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createEngraisRecommandation = async (req, res) => {
    try {

        const registerSchema = yup.lazy(() => yup.object({
            type_engrais_id: yup.number().integer().required(),
            type_culture_id: yup.number().integer().required(),
            dose_par_hectare: yup.number().required(),
            min_dose: yup.number().required(),
            max_dose: yup.number().required(),
            saison_id: yup.number().integer().required()
        }));

        try {
            await registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true })
        } catch (ex) {
            return res.status(422).json({
                httpStatus: 422,
                message: 'Erreur de validation des données',
                data: null,
                errors: ex.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }

        try {
            const data = await EngraisRecommandation.create(req.body);

            res.json({
                httpStatus: 200,
                message: "Engrais recommandation crée avec succès",
                data: data.toJSON()
            });

        } catch (error) {
            
            if (error instanceof ValidationError) {
                return res.status(422).json({
                    message: 'Erreur de validation des données',
                    httpStatus: 422,
                    data: null,
                    errors: error?.errors.reduce((acc, curr) => {
                        if (curr.path) {
                            return { ...acc, [curr.path]: curr.message }
                        }
                    }, {})
                });
            }
            res.status(500).json({
                message: 'Erreur interne du serveur',
                httpStatus: 500,
                data: null,
            });

        }
    } catch (error) {
        console.error(error);

        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Modifier une recommandation d'engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateEngraisRecommandation = async (req, res) => {
    try {
        const existingEngraisRecommandation = await EngraisRecommandation.findByPk(req.params.id_engrais_recommandations);

        if (!existingEngraisRecommandation) {
            return res.json({
                httpStatus: 404,
                message: "Engrais recommandation non trouvé",
                data: null
            })
        }

        const updateSchema = yup.lazy(() => yup.object({
            type_engrais_id: yup.number().integer().optional(),
            type_culture_id: yup.number().integer().optional(),
            dose_par_hectare: yup.number().optional(),
            min_dose: yup.number().optional(),
            max_dose: yup.number().optional(),
            saison_id: yup.number().integer().optional()
        }));

        const validatedData = await updateSchema.validate(req.body, {abortEarly: false, stripUnknown: true})
        const updated = await EngraisRecommandation.update(validatedData, { where: { id_engrais_recommandations : req.params.id_engrais_recommandations } })

        res.json({
            httpStatus: 200,
            message: 'Engrais recommandation modifié avec succès',
            data: updated
        })

    } catch (error) {
        console.log(error);

        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Trouver une seule engrais recommandation
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getOneEngraisRecommandation = async (req, res) => {
    try {
        const engrais_recommandation = await EngraisRecommandation.findByPk(req.params.id_engrais_recommandations);

        if (!engrais_recommandation) {
            return res.json({
                httpStatus: 404,
                message: 'Engrais recommandation non trouvé',
                data: null
            })
        }

        res.json({
            httpStatus: 200,
            message: 'Engrais recommandation trouvé avec succès',
            data: engrais_recommandation
        })
    } catch (error) {
        console.error(error);

        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Supprimer le(s) recommandation(s) d'engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteEngraisRecommandations = async (req, res) => {
    try {
        const ENGRAIS_RECOMMANDATION = JSON.parse(req.body.ids_engrais_recommandation);

        const engrais_recommandations = await EngraisRecommandation.findAll({
            where: { id_engrais_recommandations: ENGRAIS_RECOMMANDATION },
            attributes: ['id_engrais_recommandations']
        });

        if(!engrais_recommandations) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Engrais recommandations non trouvé',
                data: null
            })
        }

        const deleted = await EngraisRecommandation.destroy({ where: { id_engrais_recommandations: ENGRAIS_RECOMMANDATION } })

        res.json({
            httpStatus: 200,
            message: 'Engrais recommandations supprimé avec succès',
            data: deleted
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            httpStatus: 500,
            message: 'Erreur interne du serveur',
            data: null
        })
    }
}

module.exports = {
    getEngraisRecommandations,
    createEngraisRecommandation,
    getOneEngraisRecommandation,
    updateEngraisRecommandation,
    deleteEngraisRecommandations
}