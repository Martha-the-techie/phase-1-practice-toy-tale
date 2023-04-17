let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  // Fetch all toys and render them to the DOM
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      });
  }

  // Create a toy card element
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;
    card.appendChild(h2);

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";
    card.appendChild(img);

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    const button = document.createElement("button");
    button.className = "like-btn";
    button.id = toy.id;
    button.textContent = "Like ❤️";
    button.addEventListener("click", (event) => {
      increaseLikes(event.target);
    });
    card.appendChild(button);

    return card;
  }

  // Add a new toy via a POST request and render it to the DOM
  function addNewToy(event) {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((toy) => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });

    event.target.reset();
  }

  // Increase a toy's likes via a PATCH request and update it in the DOM
  function increaseLikes(button) {
    const toyId = button.id;
    const likesP = button.previousSibling;
    const currentLikes = parseInt(likesP.textContent);
    const newLikes = currentLikes + 1;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newLikes,
      }),
    })
      .then((response) => response.json())
      .then((toy) => {
        likesP.textContent = `${toy.likes} Likes`;
      });
  }

  // Event listener for the "Create Toy" form submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", addNewToy);

  // Fetch and render all toys on page load
  fetchToys();

  // Event listener for the "Add Toy" button
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
