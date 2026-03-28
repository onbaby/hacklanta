const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Represents one game on a user's profile
const GameProfileSchema = new mongoose.Schema({
  gameId: { type: String, required: true },       // e.g. "valorant"
  gameName: { type: String, required: true },     // e.g. "Valorant"
  isFavorite: { type: Boolean, default: false },
  rank: { type: String, default: '' },            // e.g. "Diamond 2"
  servers: [{ type: String }],                    // e.g. ["NA", "EU"]
  gameModes: [{ type: String }],                  // e.g. ["Ranked", "Deathmatch"]
  platforms: [{ type: String }],                  // e.g. ["PC", "PlayStation", "Xbox"]
}, { _id: false });

const UserSchema = new mongoose.Schema({
  // Auth
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  // Basic info
  username: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true },
  gender: { type: String, enum: ['man', 'woman', 'nonbinary', 'other'], required: true },

  // Dating preferences
  preferredGenders: [{ type: String }],           // e.g. ["woman", "nonbinary"]
  preferredAgeRange: {
    min: { type: Number, default: 18 },
    max: { type: Number, default: 99 },
  },
  ethnicity: { type: String, default: '' },
  preferredEthnicities: [{ type: String }],       // empty array = no preference

  // Gaming profile
  games: [GameProfileSchema],

  // Extra profile info
  bio: { type: String, default: '' },
  region: { type: String, default: '' },          // e.g. "NA East"
  playStyle: { type: String, default: '' },       // e.g. "Competitive"
  playSchedule: {
    days: [{ type: String }],          // e.g. ["monday", "friday", "saturday", "sunday"]
    timeSlots: [{ type: String }],     // e.g. ["evening", "night"]  (morning/afternoon/evening/night)
    sessionLength: { type: String, default: '' }, // e.g. "1-2h", "2-4h", "4h+"
  },
  hasMic: { type: Boolean, default: true },

  // App state
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },

  // Users this person has already swiped on (so we don't show them again)
  swipedRight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  swipedLeft: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Mutual matches
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Contact visibility — users blocked from seeing this profile
  hiddenFromUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Synced contacts (phone numbers and discord usernames) for contact matching
  syncedContacts: [{
    type: { type: String, enum: ['phone', 'discord'], required: true },
    value: { type: String, required: true },
  }],

  // Uploaded gameplay clips for highlight reels
  clips: [{
    path: { type: String, required: true },
    originalName: { type: String, default: '' },
    game: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
  }],

  // This user's phone number and discord username (for contact lookup)
  phoneNumber: { type: String, default: '' },
  discordUsername: { type: String, default: '' },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Helper to compare passwords
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Virtual age field
UserSchema.virtual('age').get(function () {
  const today = new Date();
  const birth = new Date(this.birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
});

module.exports = mongoose.model('User', UserSchema);
