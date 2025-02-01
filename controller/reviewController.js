import ReviewModel from "../model/reviewModel.js";
import handlerFactory from "./handlerFactory.js";

const reviewController = {

    setTourUserIds: (req, res, next) => {
        if (!req.body.tour) req.body.tour = req.params.tourId;
        if (!req.body.user) req.body.user = req.user.id;
        next();
    },

    getAllReviews: handlerFactory.getAll(ReviewModel),

    getReview: handlerFactory.getOne(ReviewModel),

    createReview: handlerFactory.createOne(ReviewModel),

    updateReview: handlerFactory.updateOne(ReviewModel),

    deleteReview: handlerFactory.deleteOne(ReviewModel)
};

export default reviewController;