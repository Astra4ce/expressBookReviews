const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user =>
    user.username === username && user.password === password
  );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
   const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(404).json({ message: "User does not exist" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username },
    "fingerprint_customer",
    { expiresIn: "1h" }
  );

  return res.json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    const review = req.body.review;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    books[isbn].reviews[username] = review;
  
    return res.json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "You have no review for this book" });
    }
  
    delete books[isbn].reviews[username];
  
    return res.json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
