# Chat Application Frontend

## Overview
This project is the frontend part of a chat application developed using Angular. It's designed to interface with a Java Spring Boot backend to deliver real-time messaging capabilities.

## Linking with Backend
The frontend needs to connect to the Java Spring Boot backend to function properly. You can find the backend repository and setup instructions here: [Chat App Backend](https://github.com/themane04/chat_be).

## Features
- Real-time messaging through WebSockets.
- Clean and intuitive user interface.

## Project Structure
- **app**:
  - **components**: Contains Angular components for the application.
  - **services**: Services including `websocket.service.ts` which handles WebSocket connections.
  - **models**: Data models like `message.model.ts`.
  - **pages/homepage**: Contains the homepage component with associated HTML, CSS, and TypeScript.
- **environments**: Configuration files for different deployment environments.

## Setup
To get this project up and running on your local machine, follow these steps:

1. Ensure you have Node.js and Angular CLI installed.
2. Clone the repository
```
git clone git@github.com:themane04/chat_fe.git
```
3. Navigate into the project directory
```
cd chat_fe
```
4. Install dependencies:
```
npm install
```
5. Start the development server
```
ng serve
```
6. Open a web browser and navigate to `http://localhost:4200/` to view the app.
