const express = require('express');
const router = express.Router();
const {createEntType,getAllEntTypes,getEntTypeById,updateEntType,deleteEntType} = require('../Controller/EntType');

router.post('/', createEntType);
router.get('/', getAllEntTypes);
router.get('/:id', getEntTypeById);
router.put('/:id', updateEntType);
router.delete('/:id', deleteEntType);

module.exports = router;
