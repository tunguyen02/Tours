import TourModel from '../model/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';

const tourController = {
    getAllTours: async (req, res, next) => {
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
            next(error);
        }
    },

    getTour: async (req, res, next) => {
        try {
            const id = req.params.id;
            const tour = await TourModel.findById(id);
            if (!tour) {
                return next(new AppError('No tour found with that ID', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    tour
                }
            });
        } catch (error) {
            next(error);
        }
    },

    createTour: async (req, res, next) => {
        try {
            const newTour = await TourModel.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        } catch (error) {
            next(error);
        }
    },

    updateTour: async (req, res, next) => {
        try {
            const id = req.params.id;
            const tour = await TourModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });
            if (!tour) {
                return next(new AppError('No tour found with that ID', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    tour: tour
                }
            })
        } catch (error) {
            next(error);
        }
    },

    deleteTour: async (req, res, next) => {
        try {
            const id = req.params.id;
            const tour = await TourModel.findByIdAndDelete(id);
            if (!tour) {
                return next(new AppError('No tour found with that ID', 404));
            }
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            next(error);
        }
    },

    getTourStats: async (req, res, next) => {
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
            next(error);
        }
    },

    getMonthlyPlan: async (req, res, next) => {
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
            next(error);
        }
    }
}

export default tourController;
