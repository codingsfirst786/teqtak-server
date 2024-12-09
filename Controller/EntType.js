// controllers/entTypeController.js

const EntType = require('../Schemas/EntrepenureType');
const {Logger} = require('../Functions/Logger')


const  createEntType = async (req, res) => {
  try {
    const newEntType = new EntType({_id:req.body.userId,...req.body});
    const savedEntType = await newEntType.save();
    res.json(savedEntType);
  } catch (error) {
      console.log(error)
      res.status(400).json({ message: error.message });
  }
};

// Get all entries
const  getAllEntTypes = async (req, res) => {
  try {
    const entTypes = await EntType.scan().exec();
    res.status(200).json({count:entTypes.length,data:entTypes});
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
  }
};

// Get a single entry by ID
const  getEntTypeById = async (req, res) => {
  try {
    const entType = await EntType.get(req.params.id);
    if (!entType) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json(entType);
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
  }
};

// Update an entry
const  updateEntType = async (req, res) => {
  try {
    const updatedEntType = await EntType.update({ _id: req.params.id }, req.body);
    res.status(200).json(updatedEntType);
  } catch (error) {
      console.log(error)
      res.status(400).json({ message: error.message });
  }
};

// Delete an entry
const  deleteEntType = async (req, res) => {
  try {
    await EntType.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
  }
};

module.exports = {createEntType,getAllEntTypes,getEntTypeById,updateEntType,deleteEntType}
