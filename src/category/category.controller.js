import { request, response } from "express";
import Category from "./category.model.js";

export const getCat = async (req = request, res = response) => {
    try {   
        const {limite = 10, desde = 0} = req.query;
        const query = {status : true};

        const [total, category] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting category',
            error: error.message
        })
    }
}

export const getCatById = async(req,res)=>{
    try {
        const {id} = req.params;

        const cat = await Category.findById(id);

        if(!cat){
            return res.status(404).json({
                success: false,
                msg: 'Category not found'
            })
        }

        res.status(200).json({
            success : true,
            cat
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting category',
            error: error.message
        })
    }
}

export const createCat = async(req, res) => {

    try {
        const data = req.body;
        
        const cat = await Category.create({...data})

        return res.status(201).json({
            message: "Category registred succesfully",
            category:{
                cat: cat
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Category registration failed",
            error: error.message
        });
    }
}
export const updateCat = async(req,res = response)=>{
    try {
        
        const {id} = req.params;
        const { ...data}= req.body;

        const cat = await Category.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg:'Category updated',
            cat
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error updating category',
            error: error.message
        })
    }
}