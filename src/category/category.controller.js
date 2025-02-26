import { request, response } from "express";
import Category from "./category.model.js";
import Opinion from "../opinion/opinion.model.js"

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
            category: cat       
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

export const createDefaultCategories = async () => {
    try {
        const defaultCategories = [
            { name: "world", description: "Categoría por defecto", status: true },
            { name: "fyp", description: "Categoría recomendada", status: true }
        ];

        // Verificar si ya existen estas categorías
        const existingCategories = await Category.find({ name: { $in: ["world", "fyp"] } });

        const existingNames = existingCategories.map(cat => cat.name);
        const categoriesToCreate = defaultCategories.filter(cat => !existingNames.includes(cat.name));

        // Solo crear si faltan categorías
        if (categoriesToCreate.length > 0) {
            const newCategories = await Category.insertMany(categoriesToCreate);
            console.log("Default categories created:", newCategories);
            return newCategories;
        }

        console.log("Mongo DB | Default categories already exist.");
        return existingCategories;

    } catch (error) {
        return  res.status({
            success: false,
            message: "Error creating default categories:", 
            error: error.message});
    }
};

// Reasignar comentarios antes de desactivar una categoría
export const safeDeleteCat = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la categoría existe
        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                msg: "Category not found"
            });
        }

        // Obtener categorías por defecto
        let defaultCategories = await Category.find({ name: { $in: ["world", "fyp"] } });

        if (defaultCategories.length < 2) {
            await createDefaultCategories();
            defaultCategories = await Category.find({ name: { $in: ["world", "fyp"] } });
        }

        // Escoger una categoría por defecto a la cual reasignar los comentarios
        const defaultCategory = defaultCategories[0]._id;

        // Actualizar todas las opiniones que tienen la categoría a eliminar
        await Opinion.updateMany(
            { cat: id },
            { cat: defaultCategory }
        );

        // Cambiar el estado de la categoría a false
        categoryToDelete.status = false;
        await categoryToDelete.save();

        return res.status(200).json({
            success: true,
            msg: "Category disabled and opinions reassigned",
            category: categoryToDelete
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error safely deleting category",
            error: error.message
        });
    }
};