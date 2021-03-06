'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let speakerSchema = new mongoose.Schema({

  // Credentials
  admin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    default: 'password'
  },
  nameFirst: {
    type: String,
    required: true
  },
  nameLast: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  salutation: String,
  profileComplete: {
    type: Boolean,
    default: false
  },
  archived: { // Archived users don't show up anywhere except "all" or "archived" speakerlist filters
    type: Boolean,
    default: false
  }, 

  // Speaker information
  status: {
    type: String,
    default: 'pending'
  }, // pending, accepted, denied, notifed: boolean
  statusNotification: {
    type: Boolean,
    default: false
  }, // After accepting/denying, whether they were notified
  title: String,
  organization: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  phoneWork: String,
  phoneCell: String,
  assistantOrCC: String, // Not sure what this is, not required

  bioWebsite: String, // For website/app, 125 word limit
  bioProgram: String, // For pamphlet/printed program, 60 word limit
  headshot: String, // file handling ourselves (typeform has drag/drop file selection) sanitize extensions after MVP, min/max size
  mediaWilling: Boolean,
  costsCoveredByOrg: [{ // In form: Travel/Lodging/None check all that apply
    name: String,
    covered: Boolean,
    _id: false
  }],
  speakingFees: String, // Not sure if we need a number? Selectable from dropdown?
  hasPresentedAtCCAWInPast2years: Boolean,
  recentSpeakingExp: String,
  speakingReferences: String, // At least 2
  adminNotes: String,
  adminUploads: [{
    title: String,
    url: String
  }],

  // Session ids that the speaker is involved in
  sessions: [String],

  //**** Response Form
  responseForm: {
    completed: {
      type: Boolean,
      default: false
    },

    ccawLodging: String, // yes, no, name
    // If not securedLodging fields
    dateArrival: String,
    dateDeparture: String,
    ccawCoveringHotel: String,
    agreedHotel: String,
    secureOwnLodging: String, // ccawSecure, selfSecure

    agreedTransport: String,

    agreedDates: String,
    // If not agreedDates
    whyConflict: String,

    mealDates: [{
      _id: false,
      date: String, // Based on conf dates
      meal: String, // Breakfast or lunch
      label: String,
      attending: Boolean
    }],
    dietaryNeeds: [{
      _id: false,
      need: String,
      checked: Boolean
    }],
    // If other dietary needs:
    otherDietary: String,

    bookAvailable: String,
    // If bookAvailable
    bookTitle: String,
    bookAuthor: String,

    w9: String, // whether uploaded to dropbox?
  },

  //**** Arrangements
  arrangements: [{
    associatedConf: String, //Title of associated conf

    travel: String, // yes no
    travelAmount: String,
    lodging: String, // yes no
    lodgingAmount: String,
    honorarium: String,
    lodgingConfirmNum: String,

    receivedFlightItin: String, // yes no
    arrivalAirport: String,
    arrivalDate: String,
    arrivalAirline: String,
    arrivalFlightNum: String,
    departAirport: String,
    departDate: String,
    departAirline: String,
    departFlightNum: String,
  }],
  changePassword: Boolean
});

speakerSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

speakerSchema.methods.validatePassword = (enteredPass, actualPassHash) => {
  return bcrypt.compareSync(enteredPass, actualPassHash);
};

module.exports = mongoose.model('Speaker', speakerSchema);