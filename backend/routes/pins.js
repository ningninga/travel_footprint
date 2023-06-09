const router = require("express").Router();
const Pin = require("../models/Pin");
const multer = require("multer");

const upload = multer({ dest: 'uploads/' });

//create a pin
router.post("/", upload.single('imageUrl'), async (req, res) => {
    let newPinData = { ...req.body };

    if (req.file) {
        newPinData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const newPin = new Pin(newPinData);

    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    } catch (err) {
        res.status(500).json(err);
        console.log("Failed");
    }
});

//get all pins
router.get("/", async (req, res) => {
    try{
        const pins = await Pin.find()
        res.status(200).json(pins)
    }catch(err){
        res.status(500).json(err)
    }
});


router.put('/delete-pin', async (req, res) => {
    try {
      const { id, deleteAt } = req.body;
      const updatedPin = await Pin.findByIdAndUpdate(id, { deleteAt },  { new: true });
      res.json(updatedPin);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.put('/update-pin', upload.single('imageUrl'), async (req, res) => {
    const { _id, ...updateData } = req.body;
    // console.log(_id)
  
    // If a new image is being uploaded, add it to the updateData
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
  
    if (updateData.deleteAt === "null") {
      updateData.deleteAt = null;
    }
  
    try {
      // find pin by id and update it with the request body
      try {
        const updatedPin = await Pin.findByIdAndUpdate(_id, updateData, { new: true });
  
        // If there's no pin with the provided id, send a 404 error
        if (!updatedPin) {
          return res.status(404).json({ error: 'No pin found with this ID.' });
        }
        res.json(updatedPin);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  





module.exports = router;
