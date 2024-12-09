const express = require('express');
const {createAns,createQues,deleQues,getAllQues,getMyQues,updateAns,getAllAns,getMyAns} = require('../Controller/QuesAns');
const router = express.Router();

// get my question use query
router.get('/ques/:id',getMyQues);

// get all questions for admin
router.get('/ques', getAllQues);
router.get('/ans', getAllAns);
router.get('/ans/:id', getMyAns);
router.post('/ans',createAns);
router.post('/ans/update', updateAns);

// post question by admin
router.post('/ques', createQues);

// post answer by user


// update answer by user
// delete question answer by user

router.delete('/ques/:id', deleQues);




module.exports = router;
