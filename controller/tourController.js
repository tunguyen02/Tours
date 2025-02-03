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
    },

    getToursWithin: async (req, res, next) => {
        try {
            const { distance, latlng, unit } = req.params;
            const [lat, lng] = latlng.split(',');
            const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
            if (!lat || !lng) {
                next({
                    message: 'Please provide latitude and longitude in the format lat,lng.',
                    statusCode: 400
                });
            }
            const tours = await TourModel.find({
                startLocation: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radius]
                    }
                }
            });
            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: {
                    data: tours
                }
            });
        } catch (error) {
            next(error);
        }
    },

    getDistances: async (req, res, next) => {
        try {
            const { latlng, unit } = req.params;
            const [lat, lng] = latlng.split(',');
            const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
            if (!lat || !lng) {
                next({
                    message: 'Please provide latitude and longitude in the format lat,lng.',
                    statusCode: 400
                });
            }
            const distances = await TourModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [lng * 1, lat * 1]
                        },
                        distanceField: 'distance',
                        distanceMultiplier: multiplier
                    }
                },
                {
                    $project: {
                        distance: 1,
                        name: 1
                    }
                }
            ]);
            res.status(200).json({
                status: 'success',
                data: {
                    data: distances
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default tourController;
