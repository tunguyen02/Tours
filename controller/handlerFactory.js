import APIFeatures from '../utils/apiFeatures.js';

const handlerFactory = {
    getAll: (Model) => async (req, res) => {
        try {
            let filter = {};
            if (req.params.tourId) {
                filter = { tour: req.params.tourId };
            }

            const features = new APIFeatures(Model.find(filter), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const docs = await features.query;
            res.status(200).json({
                status: 'success',
                results: docs.length,
                data: {
                    data: docs
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    getOne: (Model, popOptions) => async (req, res) => {
        try {
            let query = Model.findById(req.params.id);
            if (popOptions) query = query.populate(popOptions);
            const doc = await query;
            if (!doc) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No document found with that ID'
                });
            }
            res.status(200).json({
                status: 'success',
                data: {
                    data: doc
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    },

    createOne: (Model) => async (req, res) => {
        try {
            const doc = await Model.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    data: doc
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    updateOne: (Model) => async (req, res) => {
        try {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            if (!doc) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No document found with that ID'
                });
            }
            res.status(200).json({
                status: 'success',
                data: {
                    data: doc
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    deleteOne: (Model) => async (req, res) => {
        try {
            const doc = await Model.findByIdAndDelete(req.params.id);
            if (!doc) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No document found with that ID'
                });
            }
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },
};

export default handlerFactory;