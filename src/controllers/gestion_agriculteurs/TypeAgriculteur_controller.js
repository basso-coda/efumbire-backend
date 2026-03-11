const yup = require('yup')
const TypeAgriculteur = require('../../db/models/gestion_agriculteurs/TypeAgriculteur')
const { ValidationError, Op } = require('sequelize')

/**
 * Recupérer la liste des types de document
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */

const getTypeAgriculteurs = async (req, res) => {
    const {search} = req.query;
    try {
        let globalSearchColumns = [];

        let searchConditions = [];
        if (search && search.trim() !== "") {
            globalSearchColumns = [
            "nom_type_agriculteur"];
            globalSearchColumns.forEach(column => {
            searchConditions.push({ [column]: { [Op.substring]: search } });
            });
        }
        // console.log("=======",searchConditions);
        const whereCondition = searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

        const data = await TypeAgriculteur.findAndCountAll(
            {
                where: whereCondition
            },
        );

        res.json({
            httpStatus: 200,
            message: `Les types d'agriculteurs recupérés avec succès`,
            data
        });
    } catch (error) {
        
    }
}

/**
 * Créer un nouvel type d'agriculteur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createTypeAgriculteur = async (req, res) => {
    //Gestion d'erreur de toute la modele
    try {

        const existingTypeAgriculteur = await TypeAgriculteur.findOne({ where: {nom_type_agriculteur: req.body.nom_type_agriculteur} })

        if (existingTypeAgriculteur) {
            return res.status(422).json({
                message: "Le type de document existe deja",
                data: { nom_type_agriculteur: "Le type d'agriculteur existe deja dans la BDD" }
            })
        }

        const registerSchema = yup.lazy(() => yup.object({
            nom_type_agriculteur: yup.string().required()
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
            // return console.log(req.body)
            const data = await TypeAgriculteur.create(req.body);

            res.json({
                httpStatus: 200,
                message: 'Type agriculteur créé avec succès',
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
 * Modifier un type agriculteur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateTypeAgriculteur = async (req, res) => {
    try {
        const existingTypeAgriculteur = await TypeAgriculteur.findByPk(req.params.id_type_agriculteur);

        if (!existingTypeAgriculteur) {
            return res.json({
                httpStatus: 404,
                message: 'Type agriculteur non trouvé',
                data
            });
        }

        // Verifier si le type agriculteur existe deja dans la BDD
        if (req.body.nom_type_agriculteur !== existingTypeAgriculteur.nom_type_agriculteur) {
            const typeAgriculteurAlreadyExist = await TypeAgriculteur.findOne({where: {nom_type_agriculteur: req.body.nom_type_agriculteur}})
            if (typeAgriculteurAlreadyExist) {
                return res.status(402).json({
                    message: "Le type agriculteur existe deja dans la BDD"
                })
            }
        }

        const updateSchema = yup.lazy(() => yup.object({
            nom_type_agriculteur: yup.string().optional(),
        }));

        const validatedData = await updateSchema.validate(req.body, {abortEarly: false, stripUnknown: true})
        const updated = await TypeAgriculteur.update(validatedData, { where: { id_type_agriculteur : req.params.id_type_agriculteur } })

        res.json({
            httpStatus: 200,
            message: 'Type agriculteur modifié avec succès',
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
 * Trouver un seul type agriculteur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getTypeAgriculteur = async (req, res) => {
    try {
        const type_agriculteur = await TypeAgriculteur.findByPk(req.params.id_type_agriculteur);

        if (!type_agriculteur) {
            return res.status(404).json({
                httpStatus: 200,
                message: 'Type agriculteur non trouvé',
                data: type_agriculteur
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Type agriculteur trouvé avec succès',
            data: type_agriculteur
        });
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
 * Supprimer le(s) type(s) agriculteur(s)
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteTypeAgriculteur = async (req, res) => {
    try {
        const TYPE_AGRICULTEURS = JSON.parse(req.body.ids_type_agriculteur);

        const type_agriculteurs = await TypeAgriculteur.findAll({
            where: { id_type_agriculteur: TYPE_AGRICULTEURS },
            attributes: ['id_type_agriculteur']
        });

        if (!type_agriculteurs) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Type agriculteur non trouvé',
                data: null
            });
        }

        const deleted = await TypeAgriculteur.destroy({ where: { id_type_agriculteur: TYPE_AGRICULTEURS } })

        res.json({
            httpStatus: 200,
            message: 'Type agriculteur supprimé avec succès',
            data: deleted
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

module.exports = {
    getTypeAgriculteurs,
    createTypeAgriculteur,
    updateTypeAgriculteur,
    getTypeAgriculteur,
    deleteTypeAgriculteur
}