const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profileController");

router.get("/", profileController.getMyProfile);
router.post("/", profileController.createAndUpdateProfile);
router.post("/experience", profileController.addExperience);
router.post("/education", profileController.addEducation);
router.delete("/experience/:exp_id", profileController.deleteExperience);
router.delete("/education/:edu_id", profileController.deleteEducation);
router.delete("/", profileController.deleteUserAndProfile);

module.exports = router;
