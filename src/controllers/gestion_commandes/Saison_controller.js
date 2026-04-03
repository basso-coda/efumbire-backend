const yup = require('yup');
const Saison = require('../../db/models/gestion_commandes/Saison');
const { ValidationError, Op } = require('sequelize');

/**
 * Recupérer la liste des saisons
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getSaisons = async (req, res) => {
    const {search} = req.query;
    try {
            // Recherche globale
        let globalSearchColumns = [];

        let searchConditions = [];
        if (search && search.trim() !== "") {
            globalSearchColumns = [
            "intitule"];
            globalSearchColumns.forEach(column => {
            searchConditions.push({ [column]: { [Op.substring]: search } });
            });
        }
        // console.log("=======",searchConditions);
        const whereCondition = searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

        const data = await Saison.findAndCountAll(
            {
                where: whereCondition
            },
        );

        res.json({
            httpStatus: 200,
            message: 'Les saisons recupérés',
            data
        });
        }
    catch (error) {
        console.error(error);
        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Créer une nouvelle saison
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createSaison = async (req, res) => {
    try {
        const existingSaison = await Saison.findOne({ where: {intitule: req.body.intitule} })

        if (existingSaison) {
            return res.status(422).json({
                message: "La saison existe déjà",
                data: { intitule: "La saison existe déjà dans la BDD" }
            })
        }

        const registerSchema = yup.lazy(() => yup.object({
            intitule: yup.string().required()
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
            const data = await Saison.create(req.body);

            res.json({
                httpStatus: 200,
                message: "Saison crée avec succès",
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
 * Modifier une saison
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateSaison = async (req, res) => {
    try {
        const existingSaison = await Saison.findByPk(req.params.id_saison);

        if (!existingSaison) {
            return res.json({
                httpStatus: 404,
                message: "Saison non trouvé",
                data: null
            })
        }

        //Vérifier si la saison existe déjà dans la BDD
        if (req.body.intitule !== existingSaison.intitule) {
            const saisonAlreadyExist = await Saison.findOne({ where: { intitule: req.body.intitule } })
            if (saisonAlreadyExist) {
                return res.status(402).json({
                    message: "La saison existe déjà dans la BDD"
                })
            }
        }

        const updateSchema = yup.lazy(() => yup.object({
            intitule: yup.string().optional(),
        }));

        const validatedData = await updateSchema.validate(req.body, {abortEarly: false, stripUnknown: true})
        const updated = await Saison.update(validatedData, { where: { id_saison : req.params.id_saison } })

        res.json({
            httpStatus: 200,
            message: 'Saison modifié avec succès',
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
 * Trouver une seule saison
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getSaison = async (req, res) => {
    try {
        const saison = await Saison.findByPk(req.params.id_saison);

        if (!saison) {
            return res.json({
                httpStatus: 404,
                message: 'Saison non trouvé',
                data: null
            })
        }

        res.json({
            httpStatus: 200,
            message: 'Saison trouvé avec succès',
            data: saison
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
 * Supprimer le(s) saison(s)
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteSaison = async (req, res) => {
    try {
        const SAISONS = JSON.parse(req.body.ids_saison);

        const saisons = await Saison.findAll({
            where: { id_saison: SAISONS },
            attributes: ['id_saison']
        });

        if(!saisons) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Saison non trouvé',
                data: null
            })
        }

        const deleted = await Saison.destroy({ where: { id_saison: SAISONS } })

        res.json({
            httpStatus: 200,
            message: 'Saison supprimé avec succès',
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
    getSaisons,
    createSaison,
    getSaison,
    updateSaison,
    deleteSaison
}