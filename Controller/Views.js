const Views = require('../Schemas/Views')
const Videos = require('../Schemas/Videos')
const Podcast = require('../Schemas/Podcast')
const Reviews = require('../Schemas/Reviews')
const User = require('../Schemas/User')
const { v4: uuidv4 } = require('uuid');
const {Logger} = require('../Functions/Logger')


const createView = async (req, res) => {
    try {
        const check = await Views.scan()
            .where('viewItemId').eq(req.body.viewItemId)
            .where('viewerId').eq(req.body.viewerId).exec()
        if (check && check.length > 0) {
            res.json({ "message": "already present" })
        }
        else {
            const _id = uuidv4()
            const view = new Views({
                _id, ...req.body
            })
            await view.save()
            res.json({ message: "success", view })
        }
    } catch (error) {
        console.log(error)
        res.json({ message: "internal server error" })
    }
}

const getItemViews = async (req, res) => {
    try {
        const view = await Views.scan('viewItemId').eq(req.params.id).exec()
        res.json({ count: view.length, data: view })
    } catch (error) {
        console.log({ error })
        res.send(error)
    }

}

const getUserWatchList = async (req, res) => {

    try {
        const view = await Views.scan('viewerId')
            .eq(req.params.id)  // takes userID
            .exec()
        const data = await fun(view)
        res.json(data)
    } catch (error) {
        console.log({ error })
        res.send(error)
    }

}
const getAllViews = async (req, res) => {
    try {
        console.log("getting views")
        const view = await Views.scan().exec()
        res.json({ count: view.length, data: view })
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}



const deleteMyView = async (req, res) => {
    try {
        console.log("Deleting your view");

        const viewerId = req.params.id;
        console.log({ viewerId });

        // Scan for items
        const batch = await Views.scan('viewerId').eq(viewerId).attributes(['_id']).exec();
        const batchDel = batch.map((e) => e._id);

        // Function to split array into chunks
        const chunkArray = (arr, chunkSize) => {
            const chunks = [];
            for (let i = 0; i < arr.length; i += chunkSize) {
                chunks.push(arr.slice(i, i + chunkSize));
            }
            return chunks;
        };

        // Split into chunks of 25
        const chunks = chunkArray(batchDel, 25);
        console.log("Chunks for batch delete:", chunks);

        // Process each chunk
        for (const chunk of chunks) {
            await Views.batchDelete(chunk);
            console.log(`Deleted chunk: ${chunk}`);
        }

        res.json({ message: "Success" });
    } catch (error) {
        console.error({ error });
        res.status(500).send(error);
    }
};


const getSingleView = async (req, res) => { }
const fun = async (wishListItem) => {
    try {
        let video = await Promise.all(wishListItem.map(async (e) => {
            if (e.viewItemType == 'video') {
                try {
                    const video = await Videos.get(e.viewItemId) 
                    const userData = video && await User.get(video.userId);
                    const user = {...userData, password: undefined } 
                    if(userData && video) return { data: video, user }
                    return null
                } catch (error) {
                    return null
                }
            }
            else {
                return null
            }
        }))



        let podcast = await Promise.all(wishListItem.map(async (e) => {
            if (e.viewItemType == 'podcast') {
                const podcast = await Podcast.get(e.viewItemId)
                if (podcast) {
                    const userData = await User.get(podcast.userID);
                    const user = userData ? { ...userData, password: undefined } : null;
                    return { ...podcast, user }
                }
                else {
                    return null
                }
            }
        }))



        podcast = podcast.filter((e) => e != null)
        video = video.filter((e) => e != null)
        return { podcast, video }
    } catch (error) {
        console.log({ error })
    }
}

module.exports = { getItemViews, createView, deleteMyView, getSingleView, getAllViews, getUserWatchList }
