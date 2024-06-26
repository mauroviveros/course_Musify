"use strict";

const path  = require("path");
const fs    = require("fs");

const Song  = require("../models/song");

const populate = {
  path: "album",
  populate: {
    path: "artist"
  }
};

async function getSong(req, res){
  try {
    const songDB = await Song.findById(req.params._id).populate(populate).exec();
    return res.json(songDB);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener el detalle de la canción", error: { message: error.message } });
  };
};

async function getSongs(req, res){
  const paginationConfig = { populate };
  const paginationQuery = {};
  if(!!req.query.page) paginationConfig.page = req.query.page;
  if(!!req.query.limit) paginationConfig.limit = req.query.limit;
  if(!!req.query.album) paginationQuery.album = req.query.album;

  try {
    const songsDB = await Song.paginate(paginationQuery, paginationConfig);

    songsDB.docs = songsDB.docs.map(song => {
      song.albumName = song.album.name;
      song.artistName = song.album.artist.name;
      song.album = song.album._id;
      return song;
    });
    return res.json(songsDB);
  } catch (error) {
    return res.status(400).json({ message: "Error al obtener el listado de canciones", error: { message: error.message } });
  };
};

async function uploadSong(req, res){
  const song   = new Song(req.body);
  song.file   = undefined;

  try {
    const songStored = await song.save();
    return res.json(songStored);
  } catch (error) {
    return res.status(400).json({ message: "Error al guardar la canción", error: { message: error.message } });
  };
};

async function updateSong(req, res){
  try {
    delete req.body.image;
    const songUpdated = await Song.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.json(songUpdated);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar la canción", error: { message: error.message } });
  };
};

async function deleteSong(req, res){
  try {
    const songDeleted = await Song.findByIdAndDelete(req.params._id);
    return res.json({ status: 200, song: songDeleted });
  } catch (error) {
    return res.status(400).json({ message: "Error al borrar la canción", error: { message: error.message } });
  };
};

async function uploadFile(req, res){
  let file_name, file_ext;

  try {
    if(req.files){
      file_name = path.basename(req.files.file.path);
      file_ext  = path.extname(file_name);
    } else throw new Error("No has subido ningun archivo...");

    if(file_ext === ".mp3" || file_ext === ".ogg"){
      const songUpdated = await Song.findByIdAndUpdate(req.params._id, { file: file_name }, { new: true });
      return res.send(songUpdated);
    } else throw new Error("Extension del archivo no valido");
  } catch(error){
    return res.status(400).json({ message: "Error al actualizar el archivo de la canción", error: { message: error.message } });
  };
};

async function getFile(req, res){
  try{
    const songDB = await Song.findById(req.params._id);
    if(!songDB) throw new Error("No existe la canción");
    const path_file = `./uploads/songs/${songDB.file}`;
    const fileBool = await fs.existsSync(path_file);

    if(!fileBool) throw new Error("No existe el archivo");

    res.sendFile(path.resolve(path_file));
  } catch(error){
    return res.status(500).send({ message: "Error al obtener el archivo de la canción", error: { message: error.message } });
  };
};

module.exports = {
  getSong,
  getSongs,
  uploadSong,
  updateSong,
  deleteSong,
  uploadFile,
  getFile
};
