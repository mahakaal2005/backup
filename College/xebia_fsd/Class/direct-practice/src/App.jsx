import React, { useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleAddBook = () => {
    // TODO: implement add book logic
    const trimmedInput = input.trim();
    
    // Validation: Check if book title is empty or only whitespace
    if (trimmedInput === "") {
      setError("Book title cannot be empty.");
      return;
    }
    
    // Validation: Check if book already exists (case-insensitive)
    let bookExists = false;
    books.forEach(book => {
      if (book.title.toLowerCase() === trimmedInput.toLowerCase()) {
        bookExists = true;
      }
    });
    if (bookExists) {
      setError("Book already exists.");
      return;
    }
    
    
    // Add book if all validations pass
    setBooks([...books, { title: trimmedInput, status: "Reading" }]);
    setInput(""); // Clear input field
    setError(""); // Clear any previous errors
  };

  const handleDeleteBook = (index) => {
    // TODO: implement delete logic
    setBooks(books.filter((_, i) => i !== index));
  };

  const handleToggleStatus = (index) => {
    // TODO: implement toggle logic
    setBooks(books.map((book, i) => 
      i === index ? { 
        ...book, 
        status: book.status === "Reading" ? "Completed" : "Reading" 
      } : book
    ));
  };

  return (
    <>
      <header className="app-header">
        <h1>Book List Manager</h1>
      </header>

      <div className="App">
        <h3>Book Collection</h3>

        <input
          type="text"
          value={input}
          placeholder="Enter book title"
          onChange={(e) => setInput(e.target.value)}
          data-testid="input-field"
        />

        <button onClick={handleAddBook} data-testid="add-button">
          Add Book
        </button>

        {error && (
          <p data-testid="error-message">
            {error}
          </p>
        )}

        <ul data-testid="book-list">
          {books.map((book, index) => (
            <li key={index} data-testid="list-item">
              <span>
                {book.title} - {book.status}
              </span>

              <button
                onClick={() => handleToggleStatus(index)}
                data-testid="toggle-button"
              >
                {book.status === "Reading" ? "Mark Completed" : "Mark Reading"}
              </button>

              <button
                onClick={() => handleDeleteBook(index)}
                data-testid="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;