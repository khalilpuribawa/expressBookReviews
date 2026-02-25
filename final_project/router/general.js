const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Fungsi pembantu untuk mengecek apakah user sudah terdaftar
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Cek apakah username dan password disediakan
  if (username && password) {
    // Cek apakah username sudah ada
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user (Username/Password missing)." });
});

// Lokasi: router/general.js
// Lokasi: router/general.js
public_users.get('/', async function (req, res) {
    try {
      // Simulasi pengambilan data asinkron
      const response = await axios.get("http://localhost:5000/"); // Mengarah ke rute internal atau endpoint data
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book list" });
    }
  });

// Lokasi: router/general.js
public_users.get('/isbn/:isbn', function (req, res) {
    const getBook = new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
  
    getBook
      .then((book) => res.status(200).json(book))
      .catch((err) => res.status(404).json({ message: err }));
  });
  
// Lokasi: router/general.js
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const getBooksByAuthor = await new Promise((resolve) => {
        let filteredBooks = Object.values(books).filter(b => b.author === author);
        resolve(filteredBooks);
      });
      res.status(200).json(getBooksByAuthor);
    } catch (error) {
      res.status(404).json({ message: "Author not found" });
    }
  });

// Get all books based on title
// Lokasi: router/general.js
public_users.get('/title/:title', function (req, res) {
    const getByTitle = new Promise((resolve, reject) => {
      const title = req.params.title;
      let filteredBooks = Object.values(books).filter(b => b.title === title);
      
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found with this title");
      }
    });
  
    getByTitle
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(404).json({ message: err }));
  });
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    // Mengirimkan hanya objek reviews dari buku tersebut
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book reviews not found" });
  }
});

module.exports.general = public_users;
