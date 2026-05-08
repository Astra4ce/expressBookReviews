const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const exists = users.find(user => user.username === username);

  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/books', (req, res) => {
    res.json(books);
  });

// Get the book list available in the shop with axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message })
  }
});

// Get book details based on ISBN with axios
public_users.get("/isbn/:isbn", async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get("http://localhost:5000/books"); 
      const books = response.data;
  
      if (books[isbn]) {
        return res.json(books[isbn]);
      }
  
      return res.status(404).json({ message: "Book not found" });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });
  
// Get book details based on author with axios
public_users.get("/author/:author", async function (req, res) {
    const author = req.params.author;
  
    try {
      const response = await axios.get("http://localhost:5000/books");
      const books = response.data;
  
      const keys = Object.keys(books);
  
      const filtered = keys.filter(isbn => {
        return books[isbn].author === author;
      });
  
      const result = {};
  
      filtered.forEach(isbn => {
        result[isbn] = books[isbn];
      });
  
      return res.json(result);
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Book details by title
  public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
  
    try {
      const response = await axios.get("http://localhost:5000/books");
      const books = response.data;
  
      const keys = Object.keys(books);
  
      const filtered = keys.filter(isbn => {
        return books[isbn].title === title;
      });
  
      const result = {};
  
      filtered.forEach(isbn => {
        result[isbn] = books[isbn];
      });
  
      return res.json(result);
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
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
