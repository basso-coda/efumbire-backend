const yup = require('yup');
const TypeCulture = require('../../db/models/gestion_terrains/TypeCulture');
const { ValidationError, Op } = require('sequelize');

/**
 * Recupérer la liste des types cultures
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getTypeCultures = async (req, res) => {
    const {search} = req.query;
    try {
            // Recherche globale
        let globalSearchColumns = [];

        let searchConditions = [];
        if (search && search.trim() !== "") {
            globalSearchColumns = [
            "nom_type_culture"];
            globalSearchColumns.forEach(column => {
            searchConditions.push({ [column]: { [Op.substring]: search } });
            });
        }
        // console.log("=======",searchConditions);
        const whereCondition = searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

        const data = await TypeCulture.findAndCountAll(
            {
                where: whereCondition
            },
        );

        res.json({
            httpStatus: 200,
            message: 'Les type cultures recupérés',
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
 * Créer un nouveau type de culture
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createTypeCulture = async (req, res) => {
    try {
        const existingTypeCulture = await TypeCulture.findOne({ where: {nom_type_culture: req.body.nom_type_culture} })

        if (existingTypeCulture) {
            return res.status(422).json({
                message: "Le type culture existe déjà",
                data: { nom_type_culture: "La type culture existe déjà dans la BDD" }
            })
        }

        const registerSchema = yup.lazy(() => yup.object({
            nom_type_culture: yup.string().required()
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
            const data = await TypeCulture.create(req.body);

            res.json({
                httpStatus: 200,
                message: "Type culture crée avec succès",
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
 * Modifier un type culture
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateTypeCulture = async (req, res) => {
    try {
        const existingTypeCulture = await TypeCulture.findByPk(req.params.id_type_culture);

        if (!existingTypeCulture) {
            return res.json({
                httpStatus: 404,
                message: "Type culture non trouvé",
                data: null
            })
        }

        //Vérifier si le type culture existe déjà dans la BDD
        if (req.body.nom_type_culture !== existingTypeCulture.nom_type_culture) {
            const typeCultureAlreadyExist = await TypeCulture.findOne({ where: { nom_type_culture: req.body.nom_type_culture } })
            if (typeCultureAlreadyExist) {
                return res.status(402).json({
                    message: "Le type culture existe déjà dans la BDD"
                })
            }
        }

        const updateSchema = yup.lazy(() => yup.object({
            nom_type_culture: yup.string().optional(),
        }));

        const validatedData = await updateSchema.validate(req.body, {abortEarly: false, stripUnknown: true})
        const updated = await TypeCulture.update(validatedData, { where: { id_type_culture : req.params.id_type_culture } })

        res.json({
            httpStatus: 200,
            message: 'Type culture modifié avec succès',
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
 * Trouver un seul type culture
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getTypeCulture = async (req, res) => {
    try {
        const type_culture = await TypeCulture.findByPk(req.params.id_type_culture);

        if (!type_culture) {
            return res.json({
                httpStatus: 404,
                message: 'Type culture non trouvé',
                data: null
            })
        }

        res,json({
            httpStatus: 200,
            message: 'Type culture trouvé avec succès',
            data: type_culture
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
 * Supprimer le(s) type(s) culture(s)
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteTypeCulture = async (req, res) => {
    try {
        const TYPE_CULTURES = JSON.parse(req.body.ids_type_culture);

        const type_cultures = await TypeCulture.findAll({
            where: { id_type_culture: TYPE_CULTURES },
            attributes: ['id_type_culture']
        });

        if(!type_cultures) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Type culture non trouvé',
                data: null
            })
        }

        const deleted = await TypeCulture.destroy({ where: { id_type_culture: TYPE_CULTURES } })

        res.json({
            httpStatus: 200,
            message: 'Type culture supprimé avec succès',
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
    getTypeCultures,
    createTypeCulture,
    getTypeCulture,
    updateTypeCulture,
    deleteTypeCulture
}