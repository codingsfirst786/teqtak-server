const BlockedUser = require('../Schemas/Blocked');
const Subscription = require('../Schemas/Subscription');
const User = require('../Schemas/User');
const { v4: uuidv4 } = require('uuid');
const {Logger} = require('../Functions/Logger')


// Create a new blocked user entry
const createBlockedUser = async (req, res) => {
  try {
    const _id = uuidv4()
    const { userId, blockedId } = req.body;
    if (!userId || !blockedId) {
      return res.status(400).json({ message: 'userID and blockedID are required.' });
    }

    // Create and save a new BlockedUser entry
  
    const newBlockedUser = new BlockedUser({
      _id,
      userId,
      blockedId
    });
    const savedBlockedUser = await newBlockedUser.save();
    const shouldBlock = await cancelSubscription(userId,blockedId)
    res.status(201).json(savedBlockedUser);
  } catch (error) {
    console.error('Error creating blocked user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all blocked users for a specific user
const getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await BlockedUser.scan().exec();

    res.status(200).json({ count: blockedUsers.length, data: blockedUsers });
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getMyBlocks = async (req, res) => {
  try {
    const blockedUsers = await BlockedUser.scan('userId').eq(req.params.id).exec();
    const data = await Promise.all(blockedUsers.map(async (e) => {
      try {
        const user = await User.get(e.blockedId)
        return { ...e, user}
      } catch (error) {
        return null
      }
   
    }))
    const filteredData = data.filter((e) => e!= null)
    res.status(200).json({ count: filteredData.length, data: filteredData });
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unblock a user
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BlockedUser.delete({ _id: id });
    res.status(200).json({ message: 'User unblocked successfully', result });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const cancelSubscription = async (userId, blockedId) => {
  // my sub del
  let mySub = await Subscription.scan()
    .where("subscriberId").eq(userId)
    .where("subscribedToId").eq(blockedId)
    .attributes(["_id"])
    .exec()
  let myFollower = await Subscription.scan()
    .where("subscriberId").eq(blockedId)
    .where("subscribedToId").eq(userId)
    .attributes(["_id"])
    .exec()

   mySub = mySub.map((e)=>e._id)
   myFollower = myFollower.map((e)=>e._id)
  let batch_to_del = new Set([...myFollower,...mySub])
  batch_to_del = [...batch_to_del]
  await Subscription.batchDelete(batch_to_del)
  return true
   
}
const cancelSubscription_ = () => { }

module.exports = {
  createBlockedUser,
  getBlockedUsers,
  unblockUser,
  getMyBlocks
};
