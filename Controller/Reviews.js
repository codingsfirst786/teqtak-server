const Review = require('../Schemas/Reviews');  // Assuming you saved your schema in 'models/review.js'
const User = require('../Schemas/User');  // Assuming you saved your schema in 'models/review.js'
const Reply = require('../Schemas/ReviewsReply');  // Assuming you saved your schema in 'models/review.js'
const { v4: uuidv4 } = require('uuid');
const {Logger} = require('../Functions/Logger')


// Create a new review
exports.createReview = async (req, res) => {
    try {
        const _id = uuidv4()
        const prev = await Review.scan('userId')
        .eq(req.body.userId)
        .where('reviewItemId')
        .eq(req.body.reviewItemId)
        .limit(1)
        .exec()
        if(prev.length==0){
            const newReview = new Review({_id, ...req.body});
            const savedReview = await newReview.save();
            res.json({message:"success",savedReview});
        }
        else{
            res.json({message:"already had a review",savedReview:prev[0]});
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creating review', details: error });
    }
};

// Get all reviews
exports.getAllVideoReviews__lagacy = async (req, res) => {
    try {
        const reviews = await Review.scan('reviewItemId').eq(req.params.id).exec();
        const m =await Promise.all(reviews.map(async(e) => {
              let {name,picUrl,Users_PK} = await User.get(e.userId)
              return await {...e,sender:{name,picUrl,Users_PK}}
          }))
          
        res.json(m);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews', details: error });
    }
};


exports.getAllVideoReviews = async (req, res) => {
    try {
        const reviews = await Review.scan('reviewItemId').eq(req.params.id).exec();
        const reviewArray=reviews.map((e)=>e.reviewRatings)
        // console.log({reviewArray})
        const avgRating= mean(reviewArray)
        // console.log({avgRating})
        let bucket={
            "1":0,
            "2":0,
            "3":0,
            "4":0,
            "5":0
        }
        const hist = reviewArray.map((e)=>{
           bucket[String(e)] += 1
        })
        bucket={
            "1":parseInt(bucket["1"]/reviewArray.length*100),
            "2":parseInt(bucket["2"]/reviewArray.length*100),
            "3":parseInt(bucket["3"]/reviewArray.length*100),
            "4":parseInt(bucket["4"]/reviewArray.length*100),
            "5":parseInt(bucket["5"]/reviewArray.length*100),
        }
        // console.log({endBucket:bucket})

    
        let m =await Promise.all(reviews.map(async(e) => {
            try {
            let reply = []
              reply = await Reply.scan('reviewId').eq(e._id).exec() //takes review id
              const user = await User.get(e.userId)
              return await {...e,sender:{...user},replies:reply.length}
            } catch (error) {
             return null   
            }
          }))

          m= m.filter((e)=>e!=null)
          
        // res.json({avgRating});
        res.json({totalReviews:reviewArray.length,avgStars:bucket,avgRating,reviews:m});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews', details: error });
    }
};


exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.scan().exec();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews', details: error });
    }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.get(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching review', details: error });
    }
};

// Update a review by ID
exports.updateReviewById = async (req, res) => {
    try {
        const updatedReview = await Review.update({ _id: req.params.id }, req.body);
        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: 'Error updating review', details: error });
    }
};

// Delete a review by ID
exports.deleteReviewById = async (req, res) => {
    try {
        const deletedReview = await Review.delete(req.params.id);
        console.log({deletedReview})
        res.status(200).json({ message: 'Review deleted successfully' });
        // if (!deletedReview) {
        //     return res.status(404).json({ error: 'Review not found' });
        // }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting review', details: error });
    }
};


function mean(array) {
    if (array.length === 0) return 0;
  
    const sum = array.reduce((acc, val) => acc + val, 0);
    return sum / array.length;
  }
