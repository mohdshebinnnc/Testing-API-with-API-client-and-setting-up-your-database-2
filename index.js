const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let bookData=require("./data.json")

let library=[]
library.push(...bookData)

// app.get("/",(req,res) => {
//   res.send("Hello World")
// })

app.get("/books",(req,res) => {
  try {
    res.send(library)
  } catch (error) {
    
  }
})

app.get("/books/:id", (req,res) => {
  let id=req.params.id

  let book =library.filter((e) => e.book_id==id)
  res.send(book)
})


app.post("/books", (req, res) => {
  try {
    const newBook = req.body;

    const requiredFields = ["book_id", "title", "author", "genre", "year", "copies"];
    const missingFields = requiredFields.filter((field) => !(field in newBook));

    if (missingFields.length > 0) {
      return res.status(400).send({ message: `Missing fields: ${missingFields.join(", ")}` });
    }

    const existingBook = library.find((book) => book.book_id === newBook.book_id);
    if (existingBook) {
      return res.status(400).send({ message: "Book with this book_id already exists" });
    }

    library.push(newBook);

    res.status(201).send(newBook);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// app.post("/books", (req, res) =>{

//   const newBook = req.body;

//   if(!newBook || !newBook.book_id || !newBook.title){
//     return res.status(400).json({error:"Invalid book data"})
//   }

//   library.push(newBook)
//   res.status(201).json(newBook)

// })

app.put('/books/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  const bookIndex = library.findIndex((b) => b.book_id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  library[bookIndex] = { ...library[bookIndex], ...updates };

  res.status(200).json({ message: 'Book updated successfully!', book: library[bookIndex] });
});


app.delete('/books/:id',(req,res) => {

  const bookIndex = library.findIndex((b) => b.book_id === req.params.id);

  if(bookIndex){
    library.pop(bookIndex)
    res.status(200).json({message:"Book Deleted"})
  }else{
    res.status(401).json({message:"Book not found"})

  }
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
