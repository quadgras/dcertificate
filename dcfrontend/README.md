# MY NOTES

# Config handling
- Config is loaded using environment variables.
- The variables examples are kept in .env.example file.
- In local machine, keep `.env.development` and `.env.production`
  files. Vite uses them during `npm run dev` and `npm run build`
  respectively.
  Keep the files `.env.development` and `.env.production`
  in `.gitignore`. Its not necessary, but recommended, especially
  for production. And don't keep any secrets such as API keys in
  frontend at all.
- While deploying to a cloud such as vercel, cloudflare pages, netlify, etc.
  set the environment variables (that are listed in .env.example) on the shell.
- NOTE: You can also set the environment variables
  on the local machine's shell,
  but using `.env` files is more convenient option
  that comes built-in with Vite.
  If you don't mind commiting those files to git,
  then, you can use them in production too.
  

# TO - DO

- Implement responsive design
  to ensure that UI is functional
  and has good UX
  on both mobile and desktop view.
- Make the UI good looking
  in terms of appearance.
- Add confirm dialog in revoke page
  as a part of good UX.
- Report writing.
- Optimizing routes to avoid unnecessary
  complete page data validation.
  DETAILS
  Example - issuer/issue.jsx
  When you fetch the recipient id
  you don't want the whole page to revalidate
  but it does.
  Reason - when you make a state changing request to clientAction
  like POST, UPDATE and DELETE via Form element
  it react router revalidates the page data.
  If you use GET request in Form element,
  the form isn't sent to clientAction.
  The page reloads with
  the URL containing the form data.
  Currently known options -
  (a) use GET method in Form
      when you don't want page revalidation.
      Now obtain form details from URL
      and process inside clientLoader.
      This is simple but provides less flexibility.
      One form is ok but what happens when 
      multiple Forms can simultaneously handle page state?
      How to avoid loading already loaded data
      inside clientLoader?
      (probably by identifying using 'action' key in submitted form
       like in case of clientAction in issuer/issue.jsx )
  (b) use some explicit method to 
      prevent react router from revalidating
      inside clientAction.
- When auth token expires,
  redirect the user to correct login page.
  Currently, there is no logic to gurantee this
  and sometimes when token expires,
  application gives un-specific errors
  when token expires.

# REACT ROUTER NOTES (PREBUILT)
# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
