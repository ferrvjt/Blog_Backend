import mongoose from "mongoose";
import Post from "./post.model.js";
import CourseSchemma from "../courses/course.model.js";

// -------------------- Opiniones --------------------

export const savePost = async (req, res) => {
    try {
        const { user, cat, hdr, body } = req.body;

        // Validaciones básicas
        if (!user || !cat || !hdr || !body) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (user, cat, hdr, opn)'
            });
        }

        const category = await CourseSchemma.findOne({ _id: cat });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const opinion = new Post({
            user,
            cat: category._id,
            hdr,
            body
        });

        await opinion.save();

        res.status(200).json({
            success: true,
            opinion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving the opinion',
            error: error.message
        });
    }
};

export const getPost = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        const ops = await Post.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const opsWithCat = await Promise.all(ops.map(async (op) => {
            const cat = await CourseSchemma.findById(op.cat);
            return {
                ...op.toObject(),
                cat: cat ? cat.name : "Category not found"
            };
        }));

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            ops: opsWithCat
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting opinions',
            error: error.message
        });
    }
};

export const getPostByCourse = async (req, res) => {
    const { catId } = req.params; // ID de la categoría en la URL
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true, cat: catId };

    try {
        const ops = await Post.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const cat = await CourseSchemma.findById(catId);

        const opsWithCat = ops.map(op => ({
            ...op.toObject(),
            cat: cat ? cat.name : "Category not found"
        }));

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            ops: opsWithCat
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting opinions by category',
            error: error.message
        });
    }
};


export const searchPost = async (req, res) => {
    const { id } = req.params;

    try {
        const op = await Post.findById(id);
        if (!op) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const cat = await CourseSchemma.findById(op.cat);

        res.status(200).json({
            success: true,
            opinion: {
                ...op.toObject(),
                cat: cat ? cat.name : "Course not found"
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching course',
            error: error.message
        });
    }
};

export const deletPost = async (req, res) => {
    const { id } = req.params;

    try {
        await Post.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            message: 'Opinion deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting opinion',
            error: error.message
        });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const {...data } = req.body;

    try {
        const opinion = await Post.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: 'Post updated',
            opinion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating opinion',
            error: error.message
        });
    }
};

// -------------------- Comentarios --------------------

export const addComment = async (req, res) => {
    try {
        const {  id } = req.params;
        const { user, bodyComment } = req.body;

        if (!user || !bodyComment) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                msg: "Invalid opinion ID format"
            });
        }

        const opinion = await Post.findById(id);
        if (!opinion) {
            return res.status(404).json({
                success: false,
                msg: "Opinion not found"
            });
        }

        opinion.comments.push({ user, bodyComment });
        await opinion.save();

        return res.status(200).json({
            success: true,
            msg: "Comment added successfully",
            comments: opinion.comments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error adding comment",
            error: error.message
        });
    }
};

export const editComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { bodyComment } = req.body;

        if (!bodyComment) {
            return res.status(400).json({
                success: false,
                msg: "Comment body is required"
            });
        }

        const opinion = await Post.findById(id);
        if (!opinion) {
            return res.status(404).json({
                success: false,
                msg: "Opinion not found"
            });
        }

        const comment = opinion.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: "Comment not found"
            });
        }

        comment.bodyComment = bodyComment;
        await opinion.save();

        return res.status(200).json({
            success: true,
            msg: "Comment updated successfully",
            comment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error updating comment",
            error: error.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;

        const opinion = await Post.findById(id);
        if (!opinion) {
            return res.status(404).json({
                success: false,
                msg: "Opinion not found"
            });
        }

        const initialLength = opinion.comments.length;
        opinion.comments = opinion.comments.filter(c => c._id.toString() !== commentId);

        if (opinion.comments.length === initialLength) {
            return res.status(404).json({
                success: false,
                msg: "Comment not found"
            });
        }

        await opinion.save();

        return res.status(200).json({
            success: true,
            msg: "Comment deleted successfully",
            comments: opinion.comments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error deleting comment",
            error: error.message
        });
    }
};
