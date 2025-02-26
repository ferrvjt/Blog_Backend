import Opinion from "./opinion.model.js";
import Category from "../category/category.model.js";
import User from "../user/user.model.js";

export const saveOp = async (req,res) => {
    try {
        const data = req.body;    
        const user = await User.findOne({_uid: data.user});
        const cat = await Category.findOne({_uid: data.cat});

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if(!cat){
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }

        const op = new Opinion({
            ...data,
            user: user._id,
            cat: cat._id
        });

        await op.save();

        res.status(200).json({
            success: true,
            op
        })
    } catch (error) {
        res. status(500).json({
            success: false,
            message: 'Error saving the opinion',
            error: error.message
        })
    }
}

export const getOp= async (req, res) => {
    
    const {limite = 10, desde = 0} = req.query;

    const query = {status: true};

    try {
        
        const ops = await Opinion.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

        const opWithCatAndAuthor = await Promise.all(ops.map(async (op)=>{
            const author = await User.findById(op.user);
            const cats = await Category.findById(op.cat);
            return {
                ...op.toObject(),
                user: author ? author.name : "Author not found",
                cat: cats ? cats.name : "Category not found"
            }
        }));

        const total = await Opinion.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            ops: opWithCatAndAuthor
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting opinion',
            error
        })
    }
}

export const searchOp = async (req, res) =>{

    const {id}= req.params;

    try {
        
        const op = await Opinion.findById(id);

        if(!op){
            return res.status(404).json({
                success: false,
                message: 'Opinion not found'
            })
        }

        const author = await User.findById(op.user);
        const cat = await User.findById(op.cat);

        res.status(200).json({
            success: true,
            opinion:{
                ...op.toObject(),
                user: author ? author.name : "User not found",
                cat: cat ? cat.name : "Category not found",
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching opinion',
            error
        })
    }
}

export const deletOp = async (req, res) => {
    const {id} = req.params;
    try {
        await Opinion.findByIdAndUpdate(id,{status: false});

        res.status(200).json({
            success:true,
            message: 'Opinion delete successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting opinion',
            error: error.message
        })
    }
}

export const updateOp = async (req,res) => {
    const {id}= req.params;
    const {_id,...data} = req.body;

    try {
        const op = await Opinion.findByIdAndUpdate(id, data,{new: true});

        res.status(200).json({
            success: true,
            message:'Opinion updated',
            op
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:'Error updating opinion',
            error: error.message
        })
    }
}

//------------- Comments -------------------------------
export const addComment = async (req, res) => {
    try {
        const { opinionId } = req.params;
        const { user, bodyComment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(opinionId) || !mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ success: false, msg: "Invalid ID format" });
        }
        const opinion = await Opinion.findById(opinionId);
        if (!opinion) {
            return res.status(404).json({ success: false, msg: "Opinion not found" });
        }

        opinion.comments.push({ user, bodyComment });
        await opinion.save();

        return res.status(200).json({
            success: true,
            msg: "Comment added successfully",
            opinion
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
        const { opinionId, commentId } = req.params;
        const { bodyComment } = req.body;

        const opinion = await Opinion.findById(opinionId);
        if (!opinion) {
            return res.status(404).json({ success: false, msg: "Opinion not found" });
        }

        const comment = opinion.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, msg: "Comment not found" });
        }

        comment.bodyComment = bodyComment;
        await opinion.save();

        return res.status(200).json({
            success: true,
            msg: "Comment updated successfully",
            opinion
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
        const { opinionId, commentId } = req.params;

        const opinion = await Opinion.findById(opinionId);
        if (!opinion) {
            return res.status(404).json({ success: false, msg: "Opinion not found" });
        }

        opinion.comments = opinion.comments.filter(comment => comment._id.toString() !== commentId);
        await opinion.save();

        return res.status(200).json({
            success: true,
            msg: "Comment deleted successfully",
            opinion
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error deleting comment",
            error: error.message
        });
    }
};
