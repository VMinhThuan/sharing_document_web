const User = require("../models/user.model");

const createSuperAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "Admin@123";
    const adminFullName = "I'm Super Admin";

    // Check and drop username index if exists
    try {
      if (User.collection) {
        await User.collection.dropIndex("username_1");
      }
    } catch (error) {
      // Ignore error if index doesn't exist
    }

    // Check if admin exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        fullName: adminFullName,
        role: "admin",
      });
    }

    console.log("Super Admin created successfully");
  } catch (error) {
    console.error("Error creating super admin:", error.message);
  }
};

module.exports = createSuperAdmin;
