import mongoose from "mongoose";

const onlineClassSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  meetingLink: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Scheduled"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OnlineClass = mongoose.model("OnlineClass", onlineClassSchema);

export default OnlineClass;