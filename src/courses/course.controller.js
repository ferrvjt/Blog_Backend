import { request, response } from "express";
import Course from "./course.model.js";
import Post from "../posts/post.model.js"

// No se usara este metodo en el frontend
export const getCourse = async (req = request, res = response) => {
    try {   
        const {limite = 10, desde = 0} = req.query;
        const query = {status : true};

        const [total, category] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
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

export const getCourseByName = async(req,res)=>{
    try {
        const {name} = req.params;

          // Búsqueda por nombre que comienza con la cadena ingresada, sin importar mayúsculas/minúsculas
          const cats = await Course.find({
            name: { $regex: `^${name}`, $options: 'i' }
        });

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

// No se usara este metodo en el frontend
export const createCourses = async(req, res) => {

    try {
        const data = req.body;
        
        const cat = await Course.create({...data})

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

// No se usara este metodo en el frontend
export const updateCourse = async(req,res = response)=>{
    try {
        
        const {id} = req.params;
        const { ...data}= req.body;

        const cat = await Course.findByIdAndUpdate(id, data, {new: true});

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

export const createDefaultCourses = async () => {
    try {
        const defaultCourses = [
            { name: "Tecnologia", description: "Curso de teoria sobre los cimientos tecnicos", status: true },
            { name: "Taller", description: "Curso de aplicacion de los conociemientos tecnicos", status: true },
            { name: "Practica Supervisada", description: "Curso de uso practico y diario de los conocimientos tecnicos", status: true }
        ];

        // Verificar si ya existen estas categorías
        const existingCourses = await Course.find({ name: { $in: ["Tecnologia", "Taller","Practica Supervisada"] } });

        const existingNames = existingCourses.map(cat => cat.name);
        const coursesToCreate = defaultCourses.filter(cat => !existingNames.includes(cat.name));

        // Solo crear si faltan categorías
        if (coursesToCreate.length > 0) {
            const newCategories = await Course.insertMany(coursesToCreate);
            console.log("Default categories created:", newCategories);
            return newCategories;
        }

        console.log("Mongo DB | Default categories already exist.");
        return existingCourses;

    } catch (error) {
        return  res.status({
            success: false,
            message: "Error creating default categories:", 
            error: error.message});
    }
};

// No se usara este metodo en el frontend
// Reasignar comentarios antes de desactivar una categoría
export const safeDeleteCat = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la categoría existe
        const categoryToDelete = await Course.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                msg: "Category not found"
            });
        }

        // Obtener categorías por defecto
        let defaultCategories = await Course.find({ name: { $in: ["world", "fyp"] } });

        if (defaultCategories.length < 2) {
            await createDefaultCategories();
            defaultCategories = await Course.find({ name: { $in: ["world", "fyp"] } });
        }

        // Escoger una categoría por defecto a la cual reasignar los comentarios
        const defaultCategory = defaultCategories[0]._id;

        // Actualizar todas las opiniones que tienen la categoría a eliminar
        await Post.updateMany(
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