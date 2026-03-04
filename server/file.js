import bcrypt from "bcryptjs";

bcrypt.hash("malli@123*", 10).then(console.log);