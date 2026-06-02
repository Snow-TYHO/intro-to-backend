import {User} from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const {username , email, password} = req.body;

        //basic validation
        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        //check if user already exists
        const existingUser = await User.findOne({$or: [{username}, {email}]});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        //create new user
        const newUser = await User.create({username, email: email.toLowerCase(), password});
        res.status(201).json({message: "User registered successfully", user: newUser});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const loginUser = async (req, res) => {
    try {

        //check if the user already exists
        const {email, password} = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(400).json({message: "Invalid email or password"});
        } 

        //compare the password
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({message: "Invalid email or password"});

        res.status(200).json({message: "Login successful", 
            user:{
                id: user._id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const logoutUser = async (req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email: email.toLowerCase()});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export {registerUser
, loginUser
, logoutUser
};