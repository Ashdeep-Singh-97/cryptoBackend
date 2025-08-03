import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.MODE == 'Production',
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "Registered successfully",
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed", error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.MODE == 'Production',
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
      });

      res.json({
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  }

    async logout(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  verify(req, res) {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({ verified: false });
      }
      else {
        res.status(200).json({ "verified": true });
      }
    } catch (error) {
      console.log("error : ", error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
}

export default UserController;
