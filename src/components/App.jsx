import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const BASE_URL = "http://localhost:3001";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/toys`)
      .then((res) => res.json())
      .then((toysData) => setToys(toysData));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // Add a new toy
  async function handleAddToy(newToy) {
    // Optimistically add the toy to state immediately for better UX
    setToys((prevToys) => [...prevToys, newToy]);

    const response = await fetch(`${BASE_URL}/toys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    });
    const savedToy = await response.json();
    
    // Replace the optimistic toy with the server response (has real ID)
    setToys((prevToys) => 
      prevToys.map(toy => toy.id === newToy.id ? savedToy : toy)
    );
  }

  // Delete a toy
  async function handleDeleteToy(id) {
    await fetch(`${BASE_URL}/toys/${id}`, {
      method: "DELETE",
    });
    setToys(toys.filter((toy) => toy.id !== id));
  }

  // Like a toy
  async function handleLikeToy(id) {
    const toy = toys.find((t) => t.id === id);
    const updatedLikes = toy.likes + 1;
    
    const response = await fetch(`${BASE_URL}/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedLikes }),
    });
    const updatedToy = await response.json();
    
    setToys(toys.map((toy) => 
      toy.id === id ? updatedToy : toy
    ));
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer 
        toys={toys}
        onLike={handleLikeToy}
        onDelete={handleDeleteToy}
      />
    </>
  );
}

export default App;
