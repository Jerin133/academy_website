import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  subject: String,
  fileName: String,
  filePath: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Material = mongoose.model("Material", materialSchema);

export default Material;