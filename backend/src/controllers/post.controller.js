import {Post} from '../models/post.model.js';

//create a new post
const createPost = async (req, res) => {
    try {
        const {name, description, age} = req.body;

        //basic validation
        if (!name || !description || !age) {
            return res.status(400).json({message: "All fields are required"});
        }

        const post = await Post.create({name, description, age});
        res.status(201).json({message: "Post created successfully", post});
         
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

//read all posts
const getPosts = async (req, res) => {
    try{
        const getPosts = await Post.find();
        res.status(200).json({message: "Posts retrieved successfully", getPosts});
    } catch (error) {
        console.error("Error retrieving posts:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const updatePost = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({message: "All fields are required"});
        }

        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if(!post) {
            return res.status(404).json({message: "Post not found"});
        }
        res.status(200).json({message: "Post updated successfully", post});
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({message: "Post not found"});
        }
        res.status(200).json({message: "Post deleted successfully"});

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export {createPost, getPosts, updatePost, deletePost};