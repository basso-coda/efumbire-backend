const yup = require('yup');
const TypeEngrais = require('../../db/models/gestion_terrains/TypeEngrais');
const { ValidationError, Op } = require('sequelize');

/**
 * Recupérer la liste des types engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getTypeEngrais = async (req, res) => {
    const {search} = req.query;
    try {
            // Recherche globale
        let globalSearchColumns = [];

        let searchConditions = [];
        if (search && search.trim() !== "") {
            globalSearchColumns = [
            "nom_type_engrais"];
            globalSearchColumns.forEach(column => {
            searchConditions.push({ [column]: { [Op.substring]: search } });
            });
        }
        // console.log("=======",searchConditions);
        const whereCondition = searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

        const data = await TypeEngrais.findAndCountAll(
            {
                where: whereCondition
            },
        );

        res.json({
            httpStatus: 200,
            message: 'Les type engrais recupérés',
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
 * Créer un nouveau type engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createTypeEngrais = async (req, res) => {
    try {
        const existingTypeEngrais = await TypeEngrais.findOne({ where: {nom_type_engrais: req.body.nom_type_engrais} })

        if (existingTypeEngrais) {
            return res.status(422).json({
                message: "Le type engrais existe déjà",
                data: { nom_type_engrais: "La type engrais existe déjà dans la BDD" }
            })
        }

        const registerSchema = yup.lazy(() => yup.object({
            nom_type_engrais: yup.string().required(),
            prix: yup.number().required()
        }));

        try {
            await registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
        } catch (ex) {
            return res.status(422).json({
                httpStatus: 422,
                message: 'Erreur de validation des données',
                data: null,
                errors: ex.inner?.reduce((acc, curr) => {
                    if (curr.path) {
                        acc[curr.path] = curr.errors[0];
                    }
                    return acc;
                }, {}) || {}
            });
        }

        try {
            const data = await TypeEngrais.create(req.body);

            res.json({
                httpStatus: 200,
                message: "Type engrais crée avec succès",
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
 * Modifier un type engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateTypeEngrais = async (req, res) => {
    try {
        const existingTypeEngrais = await TypeEngrais.findByPk(req.params.id_type_engrais);

        if (!existingTypeEngrais) {
            return res.json({
                httpStatus: 404,
                message: "Type engrais non trouvé",
                data: null
            })
        }

        //Vérifier si le type culture existe déjà dans la BDD
        if (req.body.nom_type_engrais !== existingTypeEngrais.nom_type_engrais) {
            const typeEngraisAlreadyExist = await TypeEngrais.findOne({ where: { nom_type_engrais: req.body.nom_type_engrais } })
            if (typeEngraisAlreadyExist) {
                return res.status(402).json({
                    message: "Le type engrais existe déjà dans la BDD"
                })
            }
        }

        const updateSchema = yup.lazy(() => yup.object({
            nom_type_engrais: yup.string().optional(),
            prix: yup.number().optional()
        }));

        const validatedData = await updateSchema.validate(req.body, {abortEarly: false, stripUnknown: true})
        const updated = await TypeEngrais.update(validatedData, { where: { id_type_engrais : req.params.id_type_engrais } })

        res.json({
            httpStatus: 200,
            message: 'Type engrais modifié avec succès',
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
 * Trouver un seul type engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getOneTypeEngrais = async (req, res) => {
    try {
        const type_engrais = await TypeEngrais.findByPk(req.params.id_type_engrais);

        if (!type_engrais) {
            return res.json({
                httpStatus: 404,
                message: 'Type engrais non trouvé',
                data: null
            })
        }

        res.json({
            httpStatus: 200,
            message: 'Type engrais trouvé avec succès',
            data: type_engrais
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
 * Supprimer le(s) type(s) engrais
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteTypeEngrais = async (req, res) => {
    try {
        const TYPE_ENGRAIS = JSON.parse(req.body.ids_type_engrais);

        const type_engrais = await TypeEngrais.findAll({
            where: { id_type_engrais: TYPE_ENGRAIS },
            attributes: ['id_type_engrais']
        });

        if(!type_engrais) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Type engrais non trouvé',
                data: null
            })
        }

        const deleted = await TypeEngrais.destroy({ where: { id_type_engrais: TYPE_ENGRAIS } })

        res.json({
            httpStatus: 200,
            message: 'Type engrais supprimé avec succès',
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
    getTypeEngrais,
    createTypeEngrais,
    getOneTypeEngrais,
    updateTypeEngrais,
    deleteTypeEngrais
}