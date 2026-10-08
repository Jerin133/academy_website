import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json("No token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json("User not found");

        if (user.role === "student") {
            if (!user.isApproved) {
                return res.status(403).json("Your account is pending admin approval.");
            }
            if (decoded.sessionId && user.activeSessionId && decoded.sessionId !== user.activeSessionId) {
                return res.status(401).json("Your account was logged in on another device.");
            }
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json("Invalid or expired token");
    }
};

export const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json("No token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json("Not authorized as admin");
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json("Invalid or expired token");
    }
};
