const Joi = require("joi");
const Profile = require("../models/Profile");
const User = require("../models/User");

// Profile input validation using Joi
const validateProfileInput = (data) => {
  const schema = Joi.object({
    handle: Joi.string().min(2).max(40).required(),
    status: Joi.string().required(),
    skills: Joi.string().required(),
    website: Joi.string().uri(),
    youtube: Joi.string().uri(),
    twitter: Joi.string().uri(),
    facebook: Joi.string().uri(),
    linkedin: Joi.string().uri(),
    instagram: Joi.string().uri(),
  });

  return schema.validate(data);
};

// validate experience input
const validateExperienceInput = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string(),
    current: Joi.bool(),
    description: Joi.string(),
  });
  return schema.validate(data);
};

// validate experience input
const validateEducationInput = (data) => {
  const schema = Joi.object({
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldofstudy: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string(),
    current: Joi.bool(),
    description: Joi.string(),
  });
  return schema.validate(data);
};

// Read a profile
const getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "avatar"])
    .exec();

  if (!profile)
    return res.status(404).json("There is no profile for this user.");

  return res.json(profile);
};

const getUserProfileByHandle = async (req, res) => {
  try {
    const profile = await Profile.findOne({ handle: req.params.handle })
      .populate("user", ["name", "avatar"])
      .exec();

    if (!profile)
      return res.status(404).send("There is no profile for this user.");

    return res.status(200).json(profile);
  } catch (e) {
    return res.status(404).send(e);
  }
};

const getUserProfileById = async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .exec();

  if (!profile)
    return res.status(404).send("There is no profile for this user.");

  return res.status(200).json(profile);
};

// Get all profiles
const getAllProfiles = async (req, res) => {
  const profiles = await Profile.find()
    .populate("user", ["name", "avatar"])
    .exec();

  if (!profiles) return res.status(404).send("There are no profiles.");

  return res.status(200).json(profiles);
};

// Create and update a profile
const createAndUpdateProfile = async (req, res) => {
  const { error } = validateProfileInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.github_username)
    profileFields.github_username = req.body.github_username;

  // Skills
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }

  // Social media links
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  const profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );
    return res.json(profile);
  } else {
    const handle = await Profile.findOne({ handle: profileFields.handle });

    if (handle)
      return res.status(400).json({ message: "That handle already exists." });

    const result = await new Profile(profileFields).save();
    return res.json(result);
  }
};

const addExperience = async (req, res) => {
  const { error } = validateExperienceInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const profile = await Profile.findOne({ user: req.user.id }).exec();

  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };

  // Add to experience array
  profile.experience.unshift(newExp);
  const result = profile.save();
  return res.json(result);
};

const addEducation = async (req, res) => {
  const { error } = validateEducationInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const profile = await Profile.findOne({ user: req.user.id }).exec();

  const newEdu = {
    institution: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };

  // Add to education array
  profile.education.unshift(newEdu);
  const result = profile.save();
  return res.json(profile);
};

// Delete experience
const deleteExperience = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).exec();

  const removeIndex = profile.experience
    .map((item) => item.id)
    .indexOf(req.params.exp_id);

  // Splice out of array
  profile.experience.splice(removeIndex, 1);

  // Save
  const result = profile.save();
  return res.json(profile);
};
// Delete Education
const deleteEducation = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).exec();

  const removeIndex = profile.education
    .map((item) => item.id)
    .indexOf(req.params.edu_id);

  // Splice out of array
  profile.education.splice(removeIndex, 1);

  // Save
  const result = profile.save();
  return res.json(profile);
};

// Delete user and profile
const deleteUserAndProfile = async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id }).exec();
    await User.findOneAndRemove({ _id: req.user.id });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports = {
  getMyProfile,
  getUserProfileByHandle,
  getUserProfileById,
  getAllProfiles,
  addExperience,
  addEducation,
  createAndUpdateProfile,
  deleteExperience,
  deleteEducation,
  deleteUserAndProfile,
};
