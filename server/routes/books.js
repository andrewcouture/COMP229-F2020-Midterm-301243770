/*
  books.js
  Andrew Couture
  301243770 
  06/25/2023
*/



// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model

let Book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', async (req, res, next) => {
  try { 
    const Book = {
      Title: "",
      Description: "",
      Price: "",
      Author: "",
      Genre: "",
    };

    res.render('books/details', {title: 'Add a Book', book: Book })
  } 
  catch (error) {
    next(error);
  }

    /*****************
     * ADD CODE HERE *
     *****************/
    

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const author = req.body.author;
  const genre = req.body.genre;

  const addBook = new Book({
    Title: title,
    Description: description,
    Price: price,
    Author: author,
    Genre: genre
  });

  console.log('Received form data:');
  console.log('Title:', title);
  console.log('Description:', description);
  console.log('Price:', price);
  console.log('Author:', author);
  console.log('Genre:', genre);

  addBook.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/books');
    }
  });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', async (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send('Could not find book!');
    }

    const bookData = {
      title: 'Book Info:',
      book: book
    };

    res.render('books/details', bookData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

});

// POST - process the information passed from the details form and update the document
router.post('/:id', async (req, res) => {
try {
  const id = req.params.id;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const author = req.body.author;
  const genre = req.body.genre;

  const updatedBook = await Book.findByIdAndUpdate(
    id,
    { 
      Title: title,
      Description: description,
      Price: price,
      Author: author,
      Genre: genre
    },

    { 
      new: true 
    }

  );

  if (!updatedBook) {
    return res.status(404).send('Could not find book!');
  }

  res.redirect('/books');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  
});


// GET - process the delete by user id
router.get('/delete/:id', async function (req, res, next) {
  try {
    const contactId = req.params.id;
    await Book.findByIdAndRemove(contactId);
    res.redirect('/books');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
