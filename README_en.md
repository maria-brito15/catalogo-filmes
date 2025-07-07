# 🎬 Movie Catalog - Practical Assignment

- **Author:** Maria Eduarda de P. Brito  

## 📄 Project Description

This project is an **interactive movie catalog** developed with **HTML, CSS and JavaScript**, using **JSON Server** as a simulated backend through the `db.json` file. The application allows users to browse, search and favorite movies, as well as interact with various modern features of a digital catalog system.

## ✅ Features

- Home Page with movie highlights and intuitive navigation. 
- User Authentication with login, password and registration.
- Favorites System to save preferred movies. 
- Movie Search by title or category.
- Administrator Dashboard with **CRUD** functionalities (Create, Read, Update and Delete).
- View by **Genres and Categories** with specific pages.
- Genre Chart with visual data about movie distribution.
- User Profile with editable image and data.

## 📁 Folder Structure

```
catalogo_de_filmes/
│
├── .git/
├── db/
│   └── db.json
│
├── public/
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── scripts/
│   │       ├── app.js
│   │       ├── auth.js
│   │       ├── dashboard.js
│   │       ├── favoritos.js
│   │       ├── generos.js
│   │       ├── graf.js
│   │       ├── login.js
│   │       ├── perfil.js
│   │       └── resultados.js
│   │
│   ├── categoria.html
│   ├── dashboard.html
│   ├── detalhes.html
│   ├── favoritos.html
│   ├── generos.html
│   ├── index.html
│   ├── login.html
│   ├── perfil.html
│   └── resultados.html
│
├── .gitignore
├── package.json
└── README.md
```

## 🔑 Site Access

Users can only interact with the site if they are logged in. You can use one of the available accounts below or create a new one:

### 👤 Access Accounts

- **Administrator:**  
  Email: `admin@abc.com`  
  Password: `123`  
  **Access Dashboard:** The dashboard only becomes available for the administrator account, even if accessed directly through the URL:  
  `http://localhost:3000/dashboard.html`.

- **Regular User:**  
  Email: `user@abc.com`  
  Password: `123`

### 🚪 Logout from Current Account

To log out from the account used in the current session, the user must go to the **profile** section and click the red **"Logout"** button.

---

## ⚙️ Requirements to Run the Project Locally

For the site to work correctly in a local development environment, some conditions must be met.

### ✅ 1. Have Node.js Installed

Node.js is a platform that allows running JavaScript outside the browser. It is essential to run the development server and install project dependencies.

- Download the LTS version at:  
  [https://nodejs.org/](https://nodejs.org/)

- After installing, verify everything is working with the following commands in the terminal:

```bash
node -v
npm -v
```

---

### ✅ 2. Have npm (Node Package Manager)

`npm` is usually installed along with Node.js. It is responsible for installing and managing project packages (dependencies).

---

### ✅ 3. Install Project Dependencies

After downloading or cloning the project, open the terminal in the project folder and run:

```bash
npm install
```

This command will install all necessary libraries that are listed in the `package.json` file.

---

### ✅ 4. Run the Project with `npm start`

After installing dependencies, start the project with:

```bash
npm start
```

This command will run the local server and open the site in the browser, usually at:

```
http://localhost:3000
```

---

If you need help setting up the environment or customizing access behavior based on user type, contact the development team or consult the project documentation.

## 📷 Screen Prints with Implementation

### Home Page - *index.html*

<img src="public/assets/images/prints/inicial/entrada.png">

### Search Results Page - *resultados.html*

<img src="public/assets/images/prints/exemplo_pesquisa.png">

### Details Page - *detalhes.html*

<img src="public/assets/images/prints/detalhes.png">

### Categories Page - *categoria.html*

<img src="public/assets/images/prints/categorias/populares.png">

### Genre Filter Page - *generos.html*

<img src="public/assets/images/prints/genero_pesquisa/depois.png">

### Profile Page - *perfil.html*

<img src="public/assets/images/prints/perfil.png">

### Favorites Page - *favoritos.html*

<img src="public/assets/images/prints/favoritos.png">

### Admin Dashboard Page - *dashboard.html*

<img src="public/assets/images/prints/dashboard.png">
