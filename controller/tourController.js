import TourModel from '../model/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';

const tourController = {
    getAllTours: async (req, res) => {
        try {
            const features = new APIFeatures(TourModel.find(), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            const tours = await features.query;
            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: {
                    tours
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    },

    getTour: async (req, res) => {
        try {
            const id = req.params.id;
            const tour = await TourModel.findById(id);
            res.status(200).json({
                status: 'success',
                data: {
                    tour
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    createTour: async (req, res) => {
        try {
            const newTour = await TourModel.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    updateTour: async (req, res) => {
        try {
            const id = req.params.id;
            const updatedTour = await TourModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });
            res.status(200).json({
                status: 'success',
                data: {
                    tour: updatedTour
                }
            })
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });
        }
    },

    deleteTour: async (req, res) => {
        try {
            const id = req.params.id;
            await TourModel.findByIdAndDelete(id);
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

    getTourStats: async (req, res) => {
        try {
            const stats = await TourModel.aggregate([
                {
                    $match: { ratingsAverage: { $gte: 4.5 } }
                },
                {
                    $group: {
                        _id: { $toUpper: '$difficulty' },
                        numTours: { $sum: 1 },
                        numRatings: { $sum: '$ratingsQuantity' },
                        avgRating: { $avg: '$ratingsAverage' },
                        avgPrice: { $avg: '$price' },
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                },
                {
                    $sort: { avgPrice: 1 }
                },
                // {
                //     $match: { _id: { $ne: 'EASY' } }
                // }
            ]);
            res.status(200).json({
                status: 'success',
                data: {
                    stats
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    },

    getMonthlyPlan: async (req, res) => {
        try {
            const year = req.params.year * 1;
            const plan = await TourModel.aggregate([
                {
                    $unwind: '$startDates'
                },
                {
                    $match: {
                        startDates: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$startDates' },
                        numTourStarts: { $sum: 1 },
                        tours: { $push: '$name' }
                    }
                },
                {
                    $addFields: { month: '$_id' }
                },
                {
                    $project: {
                        _id: 0
                    }
                },
                {
                    $sort: { numTourStarts: -1 }
                },
                {
                    $limit: 12
                }
            ]);
            res.status(200).json({
                status: 'success',
                data: {
                    plan
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error
            });

        }
    }
}

export default tourController;
