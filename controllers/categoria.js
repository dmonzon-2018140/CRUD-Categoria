const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const Categoria = require('../models/categoria');

const getCategorias = async(req = request, res = response) => {
    //condiciones del get
    const query = { estado: true };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Categoria',
        listaCategorias
    }); 
}

const postCategoria = async(req = request, res = response) => {
    //Desestructuración
    const { nombre, participantes, rol } = req.body;
    const categoriaGuardadaDB = new Categoria({ nombre, participantes, rol });

    //Encriptar participantes
    const salt = bcrypt.genSaltSync();
    categoriaGuardadaDB.participantes = bcrypt.hashSync(participantes, salt);

    //Guardar en DB
    await categoriaGuardadaDB.save();
    
    res.json({
        msg: 'Post Api - Post Categoria',
        categoriaGuardadaDB
    });
}

const putCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, img, rol, estado, ...resto } = req.body;

    if(resto.participantes){
        const salt = bcrypt.genSaltSync();
        resto.participantes = bcrypt.hashSync(resto.participantes, salt);
    }

    //Editar categoria
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'Put editar categoria',
        categoriaEditada
    });
}

const deleteCategoria = async(req = request, res = response) => {
    const { id } = req.params;

    const categoriaEliminada = await Categoria.findByIdAndDelete(id);

    //Eliminar cambiando el estado a false
    //const categoriaEliminada = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'Delete eliminar categoria',
        categoriaEliminada
    })
}

module.exports = {
    getCategorias,
    postCategoria,
    putCategoria,
    deleteCategoria
}


// CONTROLADOR