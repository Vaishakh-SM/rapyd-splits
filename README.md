<p align="center">
  <img src="/client/src/assets/logo.png" height="200px" alt="Sublime's custom image"/>
</p>

<h1 align="center">RapydSplits</h1>

<p align="center">What's love if not sharing bills</p>

## About

RapydSplits is a fully integrated hostable project which should allow you to host a service which other people can register to get easily integrable group payments on their superapp. It was made as a submission to [Hack The Galaxy Hackathon](https://htg3.devpost.com). The project comes with a landing page, an dashboard for easy integration and private rooms to which customers can join and carry out group transactions without hassle. The landing page also comes with some docs. Check out a hosted version [here](https://rapydsplits.live)

## Setting up

The project is divided into two parts, client and server. Both needs to be run at the same time for the project to work.
The ease this process, a `Makefile` is included. To run the server, run the following in two different terminals

```sh
make start_server
```
and

```sh
make start_frontend
```

from the project root directory to start the server.

### Environment variables

A few environment variables are required for various purposes. A sample `.env` file is depicted below

```.env
MONGO_URL=<>
RAPYD_SECRET=<>
RAPYD_ACCESS=<>
GITHUB_CLIENT=<>
GITHUB_SECRET=<>
SESSION_SECRET=<random string used as encryption key>
AUTH_REDIRECT="/auth/github/callback"
NODE_ENV=development
```
You can either setup environment variables manually or put these as a `.env` file inside the `/server` folder.

## Project Structure

This project follows the monorepo format but not strictly. Both frontend and server are in a single repository to reduce confusion.

### /client

Contains the main frontend of the project, made using `React`, packaged and built using `vite`. All the code is strictly typed which should also serve as a helper for future maintainability.

The `src` folder contains the bulk of the code while the `types` folder containes types for packages which doesn't have typing inbuilt or as part of [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

#### /src

Has multiple subfolder for the entire website. This includes the main website, the admin panel and the rooms ui

All routes are defined in the `main.tsx` file and other route names should be self explanatory.

### /server

Contains the code for the `ExpressJS` backend. Like the frontend, this is also fully typed and uses esbuild for packaging (yes, packaging for backend).

The `prisma` folder contains all out database models and the `src` folder contains the actual server code.

#### /src

The `index.ts` file has all the routers and middlewares setup (which come from the `/middleware` folder). Custom types are defined in `/types` folder
and all the api routes reside in the `routes` folder. The socket server (upon which the rooms functionality work) is also setup in this file and the rest happens in the `socket.ts` file.

## Sample integration

Check out [rapyd-demo](https://github.com/Muhammedsinanck/rapyd-demo) to see how one can go about integrating the group payment feature into their app.










