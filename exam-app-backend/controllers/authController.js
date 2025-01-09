const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password } = req.body;
  let role="";
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if(email==="appgenix@gmail.com"){
      role="admin";
    }else{
       role = "student";
    }
    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role, // Default role, this can be changed later to 'admin' if needed
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET, // Secret should be stored in environment variables
      { expiresIn: "1h" } // Token expiration time
    );

    // Respond with token and role
    return res.status(201).json({ token, role: newUser.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Secret should be stored in environment variables
      { expiresIn: "1h" } // Token expiration time
    );

    // Respond with token and role
    return res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { register, login };
