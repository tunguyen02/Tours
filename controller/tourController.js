import TourModel from '../model/tourModel.js';
import handlerFactory from './handlerFactory.js';

const tourController = {
    getAllTours: handlerFactory.getAll(TourModel),

    getTour: handlerFactory.getOne(TourModel, { path: 'reviews' }),

    createTour: handlerFactory.createOne(TourModel),

    updateTour: handlerFactory.updateOne(TourModel),

    deleteTour: handlerFactory.deleteOne(TourModel),

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
