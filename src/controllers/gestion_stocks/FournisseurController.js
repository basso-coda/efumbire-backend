const yup = require('yup')
const Fournisseur = require('../../db/models/gestion_stocks/Fournisseur')
const { ValidationError, Op } = require('sequelize')

/**
 * Recupérer la liste des fournisseurs
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */

const getFournisseurs = async (req, res) => {
    const {search} = req.query;
    try {
        let globalSearchColumns = [];

        let searchConditions = [];
        if (search && search.trim() !== "") {
            globalSearchColumns = [
            "nom_fournisseur"];
            globalSearchColumns.forEach(column => {
            searchConditions.push({ [column]: { [Op.substring]: search } });
            });
        }
        // console.log("=======",searchConditions);
        const whereCondition = searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

        const data = await Fournisseur.findAndCountAll(
            {
                where: whereCondition
            },
        );

        res.json({
            httpStatus: 200,
            message: `Les fournisseurs recupérés avec succès`,
            data
        });
    } catch (error) {
        
    }
}

/**
 * Créer un fournisseur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createFournisseur = async (req, res) => {
    //Gestion d'erreur de toute la modele
    try {

        const existingFournisseur = await Fournisseur.findOne({ where: {nom_fournisseur: req.body.nom_fournisseur} })

        if (existingFournisseur) {
            return res.status(422).json({
                message: "Le fournisseur existe deja",
                data: { nom_fournisseur: "Le fournisseur existe deja dans la BDD" }
            })
        }

        const registerSchema = yup.lazy(() => yup.object({
            nom_fournisseur: yup.string().required(),
            numero_telephone: yup.string().required()
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
            const data = await Fournisseur.create(req.body);

            res.json({
                httpStatus: 200,
                message: 'Fournisseur créé avec succès',
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
 * Modifier un fournisseur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateFournisseur = async (req, res) => {
    try {
        const existingFournisseur = await Fournisseur.findByPk(req.params.id_fournisseur);

        if (!existingFournisseur) {
            return res.json({
                httpStatus: 404,
                message: 'Fournisseur non trouvé',
                data
            });
        }

        // Verifier si le type agriculteur existe deja dans la BDD
        if (req.body.nom_fournisseur !== existingFournisseur.nom_fournisseur) {
            const fournisseurAlreadyExist = await Fournisseur.findOne({where: {nom_fournisseur: req.body.nom_fournisseur}})
            if (fournisseurAlreadyExist) {
                return res.status(402).json({
                    message: "Le fournisseur existe deja dans la BDD"
                })
            }
        }

        const updateSchema = yup.lazy(() => yup.object({
            nom_fournisseur: yup.string().optional(),
            numero_telephone: yup.string().optional()
        }));

        const validatedData = await updateSchema.validate(req.body, {abortEarly: false, stripUnknown: true})
        const updated = await Fournisseur.update(validatedData, { where: { id_fournisseur : req.params.id_fournisseur } })

        res.json({
            httpStatus: 200,
            message: 'Fournisseur modifié avec succès',
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
 * Trouver un seul fournisseur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getFournisseur = async (req, res) => {
    try {
        const fournisseur = await Fournisseur.findByPk(req.params.id_fournisseur);

        if (!fournisseur) {
            return res.status(404).json({
                httpStatus: 200,
                message: 'Fournisseur non trouvé',
                data: fournisseur
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Fournisseur trouvé avec succès',
            data: fournisseur
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
const deleteFournisseur = async (req, res) => {
    try {
        const FOURNISSEURS = JSON.parse(req.body.ids_fournisseur);

        const fournisseurs = await Fournisseur.findAll({
            where: { id_fournisseur: FOURNISSEURS },
            attributes: ['id_fournisseur']
        });

        if (!fournisseurs) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Fournisseur non trouvé',
                data: null
            });
        }

        const deleted = await Fournisseur.destroy({ where: { id_fournisseur: FOURNISSEURS } })

        res.json({
            httpStatus: 200,
            message: 'Fournisseur supprimé avec succès',
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
    getFournisseurs,
    createFournisseur,
    updateFournisseur,
    getFournisseur,
    deleteFournisseur
}