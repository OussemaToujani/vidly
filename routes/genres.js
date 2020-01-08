const express = require('express');
const router = express.Router();

const genres = [
  {id: 0, name: 'Action'},
  {id: 1, name: 'Drama'},
  {id: 2, name: 'Comedy'}
];


router.get('/', (req, res) => {
  res.send(JSON.stringify(genres));
});


router.get('/:id', (req, res) => {
  if (genres.find((genre) => genre.id == req.params.id)) {
    res.send(JSON.stringify(genres.find((genre) => genre.id == req.params.id)));
  } else {
    res.status(404).send('A genre with the given id cannot be found');
  }
});


router.post('/', (req, res) => {
  const newGenre = req.body;
  if (genres.find((genre) =>
    newGenre.name === genre.name || newGenre.id === genre.id)) {
    res.status(400).send('genre with same id or name already exists');
  } else {
    if (!newGenre.id && genres.length > 0) {
      newGenre.id = genres[genres.length - 1].id + 1;
    } else if ( genres.length == 0 ) {
      newGenre.id = 0;
    }
    genres.push(newGenre);
    res.status(200).send(JSON.stringify(newGenre));
  }
});


router.put('/:id', (req, res) => {
  const targetGenreIndex =
  genres.findIndex((genre) => req.params.id == genre.id);

  if (targetGenreIndex != -1) {
    genres[targetGenreIndex].name = req.body.name;
    res.status(200).send(JSON.stringify(genres[targetGenreIndex]));
  } else {
    res.status(404).send('no genre with the provided id exists');
  }
});


router.delete('/:id', (req, res) => {
  const targetGenreIndex =
  genres.findIndex((genre) => req.params.id == genre.id);

  if (targetGenreIndex != -1) {
    res.status(200).send(JSON.stringify(genres.splice(targetGenreIndex, 1)));
  } else {
    res.status(404).send('no genre with the provided id exists');
  }
});


module.exports = router;
