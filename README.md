# FC-Website

**A Personal Presentation Website**

This is my personal website, built to showcase my web development skills using Next.js 14. Through this project, I explore and demonstrate modern front-end techniques, including internationalization (i18n), component structuring best practices, and Dockerization.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
  - [React Three Fiber for 3D Animations](#react-three-fiber-for-3d-animations)
  - [Internationalization](#internationalization)
  - [Dockerization](#dockerization)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)

---

## Project Overview

FC-Website is a Next.js-based personal site built to present my web development skills. This project emphasizes:
- A modular structure with component-based design.
- Comprehensive internationalization, making the site accessible in multiple languages.
- Dockerization for streamlined setup and deployment.

---

## Features

- **3D Animated Scenes**: Engaging 3D animations created using React Three Fiber for enhanced interactivity.
- **Internationalization**: Content is available in multiple languages, including English, Portuguese, and Spanish.
- **Responsive Design**: Ensures accessibility across various devices.
- **Dockerized Environment**: Fully containerized for a consistent and reliable environment setup.

---

## Folder Structure

This structure highlights the main folders related to functionality and i18n support.
```bash
.
├── messages                   # Contains translation files for each language
│   ├── en.json                # English translations
│   ├── pt.json                # Portuguese translations
│   └── es.json                # Spanish translations
│
├── src
│   ├── i18n
│   │   ├── routing.ts         # Route configuration for language handling
│   │   └── request.ts         # Language-specific configuration for each request
│   │
│   ├── app
│   │   ├── [locale]           # Dynamic directory for each language
│   │   │   ├── layout.tsx     # Layout with internationalization support
│   │   │   ├── components     # Holds components that may require language translation
│   │   │   │   └── NavBar.tsx # Navigation component with language support
│   │   │   └── page.tsx       # Main page
│   │   ├──  favicon.ico       # Recognized by Next.js 14 for generating the site tab icon
│       ├── scenes             # Contains 3D scenes using React Three Fiber
│   │         └── Scene.tsx    # Main 3D animation scene
│   │      
│   │      

├── public                     # Contains images for the project
│
└── README.md                  # Project documentation
```

## React Three Fiber for 3D Animations

FC-Website uses React Three Fiber to create immersive 3D animations and scenes directly within the React component structure. This library allows smooth and highly customizable 3D animations, enhancing the user experience. The 3D models are imported as GLB files and rendered using a Canvas component, which integrates seamlessly with React’s rendering cycle.

Key files and folders for 3D animations:

- **scenes/Scene.tsx**: The main 3D scene rendered using React Three Fiber.
- **models**: Folder containing 3D models (GLB files) for different animated scenes.

## Internationalization

The project leverages the `next-intl` library for internationalization, allowing dynamic language switching based on a language prefix (e.g., `/en`, `/pt`, `/es`). Each language's translations are stored in JSON files within the `messages` folder.

- **Routing Configuration**: Managed by `routing.ts` and `request.ts` in the `i18n` folder to ensure consistent language-based routing across components.

---

## Dockerization

FC-Website is fully Dockerized, enabling easy setup and consistent environment management across various systems. Dockerization allows for quick deployment and smooth transitions between development and production environments.

---

## Getting Started

### Installation
1. **Clone the repository**:
    ```bash
   git clone https://github.com/FernandoLCarvalho/FC-Website.git
    ```
2. **Navigate into the project directory**:
    ```bash
    cd FC-Website
    ```
3. **Run the Dockerized environment (this will automatically install dependencies inside the container)**:
     ```bash
    docker-compose up --build
    ```
##  Accessing the Application

    After running the Docker setup, you can access the application by visiting http://localhost:3001 in your web browser.

## Deployment

- **Link**: Yet not available