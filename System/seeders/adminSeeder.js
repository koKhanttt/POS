const connectDB = require("../utils/database");
const Admin = require("../models/Admins");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log("Seeding admin user...");
    
    // Create new admin with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    
    const adminData = {
      username: "Admin",
      email: "admin@pos.com",
      password: hashedPassword,
      role: "superadmin"
    };
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log("✅ Admin already exists with email:", existingAdmin.email);
      return;
    }
    
    // Create new admin
    const admin = new Admin(adminData);
    await admin.save();
    console.log("✅ Admin seeded successfully");
    console.log("Credentials:");
    console.log("- Email: admin@pos.com");
    console.log("- Password: admin123");
    console.log("- Role: superadmin");
    
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;