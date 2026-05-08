const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn])
  }

  return res.status(404).json({ message: "Book not found" });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  keys = Object.keys(books)

  const filtered = keys.filter(isbn => {
    return books[isbn].author === author;
  });

  const result = {};

  filtered.forEach(isbn => {
    result[isbn] = books[isbn];
  });

  return res.json(result);
  
});

public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
  
    const result = Object.fromEntries(
      Object.entries(books).filter(([isbn, book]) => {
        return book.title === title;
      })
    );
  
    res.json(result);
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    return res.json(book.reviews);
  });

module.exports.general = public_users;
