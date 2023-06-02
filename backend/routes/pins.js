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
})





module.exports = router;
