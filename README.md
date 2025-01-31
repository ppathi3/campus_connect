# Campus Connect

Campus Connect is a web application designed to facilitate campus activities and communication. A one stop destination to all the students out there to step into a world that has a mix of fun, cultural activities, sports and what not. Explore Campus Connect right now!

## Table of Contents
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)

## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- Node.js
- npm (Node Package Manager)
- nodemon (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ppathi3/campus_connect.git
   ```
2. **Navigate into the project directory**
```bash
cd campus_connect
```
3. **Install dependencies**
```bash
npm install
```


### Running the application
To start the application, you have two options:
1. **Using node**

```bash
node app.js
```

2. **Using nodemon (recommended for development)**

```bash
nodemon app.js
```
The application should now be running on http://localhost:3000.

## File Structure
Here is a brief overview of the main directories and files in the project:

- controllers/: Contains the application's business logic.
In this directory, there are three controllers: Event, User and General controller to handle different functionalities of the application.

- helpers/: Utility functions and helper modules used throughout the application.

- middleware/: Custom middleware functions for handling requests and responses.
Four middlewares have been added to take care of Authorization, fileUpload, rate limiting and validation of form fields.

- models/: Database schemas and models.
Three models are used in the context of the application: User, Event and RSVP

- public/: Static files such as CSS, JavaScript, and images.

- routes/: Route definitions and handlers.
In this directory, there are three route files: Event, User and General routes to handle related functionalities of the application.

- views/: Template files for rendering HTML views.

- app.js: The main entry point of the application.

- package-lock.json: Automatically generated file that describes the exact tree that was generated by npm install.

- package.json: Lists the project dependencies and scripts.

## Technologies Used

- Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express.js: Web framework for Node.js.
- MongoDB: NoSQL database.
- Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
- EJS: Embedded JavaScript templating.
