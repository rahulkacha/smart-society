user = {
  U_ID: Number, // default generated mongoose ObjectID
  FlatNo: String,
  name: String,
  contact: Number,
  email: String,
  password: String,
  occupantType: String, // tenant or owner
  type: String, // resident or admin
  society: String, // link to the society collection
  societyCode: String, // link to society collection
};

amenities = {
  A_ID: Number, // default generated mongoose ObjectID
  name: String,
  photo: Image,
  bookings: [
    {
      user_id: String, // the person who has booked the amenity
      bookedFromDate: String,
      bookedTillDate: String,
      description: String,
    },
  ],
};

complaint = {
  C_ID: Number, // default generated mongoose ObjectID
  Type: String,
  user: String, // user id linking back to users collections
  description: String,
  status: Boolean, // resolved/pending
};

// meeting = {
//   M_ID: Number, // default generated mongoose ObjectID
//   conversation: String,
//   datetime: String,
// };

// society = {
//   S_ID: Number, // default generated mongoose ObjectID
//   name: String,
//   address: String,
//   societyCode: String,
// };

// admin = {
//   name: String,
//   contact: Number,
//   email: String,
//   password: String,
//   society: String, // link to the society collection
//   societyCode: String, // link to society collection
// };
