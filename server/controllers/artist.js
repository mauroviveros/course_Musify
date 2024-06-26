"use strict";

const path  = require("path");
const fs    = require("fs");

const Artist  = require("../models/artist");
const Album   = require("../models/album");
const Song    = require("../models/song");


async function getArtist(req, res){
  try {
    const artistDB = await Artist.findById(req.params._id);
    return res.json(artistDB);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener el detalle del artista", error: { message: error.message } });
  };
};

async function getArtists(req, res){
  const paginationConfig = {};
  if(!!req.query.page) paginationConfig.page = req.query.page;
  if(!!req.query.limit) paginationConfig.limit = req.query.limit;


  try {
    const artistsDB = await Artist.paginate({}, paginationConfig);
    return res.json(artistsDB);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener el listado de artistas", error: { message: error.message } });
  };
};

async function uploadArtist(req, res){
  const artist    = new Artist(req.body);
  artist.image  = undefined;

  try {
    const artistStored = await artist.save();
    return res.json(artistStored);
  } catch (error) {
    return res.status(400).json({ message: "Error al guardar el artista", error: { message: error.message } });
  };
};

async function updateArtist(req, res){
  try {
    delete req.body.image;
    const artistUpdated = await Artist.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.json(artistUpdated);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar el artista", error: { message: error.message } });
  };
};

async function deleteArtist(req, res){
  try {
    const artistDeleted = await Artist.findByIdAndDelete(req.params._id);
    if(!artistDeleted) throw new Error("No existe el artista que desea eliminar");

    const albumDeleted = await Album.findOneAndDelete({ artist: artistDeleted._id });
    if(albumDeleted) await Song.findOneAndDelete({ album: albumDeleted._id });

    return res.json({ status: 200, artist: artistDeleted });
  } catch (error) {
    return res.status(400).json({ message: "Error al borrar el artista", error: { message: error.message } });
  };
};


async function uploadImage(req, res){
  let file_name, file_ext;

  try {
    if(req.files){
      file_name = path.basename(req.files.image.path);
      file_ext  = path.extname(file_name);
    } else throw new Error("No has subido ninguna imagen...");

    if(file_ext === ".png" || file_ext === ".jpg" || file_ext === ".gif"){
      const artistUpdated = await Artist.findByIdAndUpdate(req.params._id, { image: file_name }, { new: true });
      return res.send(artistUpdated);
    } else throw new Error("Extension del archivo no valida");
  } catch(error){
    return res.status(400).json({ message: "Error al actualizar la imagen del artista", error: { message: error.message } });
  };
};

async function getImage(req, res){
  try{
    const artistDB = await Artist.findById(req.params._id);
    if(!artistDB) throw new Error("No existe el artista");
    let path_file = `./uploads/artists/${artistDB.image}`;
    const imageBool = await fs.existsSync(path_file);

    if(!imageBool) path_file = "./uploads/artists/empty.png";

    res.sendFile(path.resolve(path_file));
  } catch(error){
    return res.status(500).send({ message: "Error al obtener la imagen del artista", error: { message: error.message } });
  };
};

module.exports = {
  getArtist,
  getArtists,
  uploadArtist,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImage
};
