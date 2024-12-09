const Table = require('../Schemas/User')
const Delete_Table = async (req, res) => {
  try {
    console.log("deleting")
    // console.log({Table})
    const items = await Table.scan().exec();
    const deletePromises = items.map((item) => Table.delete(item.Users_PK));
    await Promise.all(deletePromises);
    console.log("All items deleted successfully!");
    res.send("All items deleted successfully!")
  } catch (error) {
    console.error("Error deleting items:", error);
  }
}

module.exports = {Delete_Table}
