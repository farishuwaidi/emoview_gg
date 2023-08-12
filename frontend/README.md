# EmoView Frontend REST API

This is a Nuxt.js application that leverages a REST API and Auth0 for authentication.

## Setup Environment Variables

Before running the Nuxt.js application, you need to set up the following environment variables include some Auth0 environment.

- `NUXT_ENV_RESTAPI_BASE_URL:` The base URL for the REST API server. Set it to `http://localhost:3005/` during development.

- `NUXT_ENV_AUTH0_DOMAIN:` The Auth0 domain associated with your Auth0 application.

- `NUXT_ENV_AUTH0_CLIENT_ID:` The Auth0 client ID for your application.

- `NUXT_ENV_AUTH0_AUDIENCE:` The Auth0 audience URL for your application. This is typically in the format `https://YOUR_AUTH0_DOMAIN/api/v2/`.

## Environment Variable Configuration

You can configure these environment variables in your Nuxt.js project by following these steps:

1. Copy the content from the .env.example file in the root directory of your Nuxt.js project.

2. Rename the copied file to .env.

3. Replace the placeholder values in the .env file with the actual values specific to your development environment:

   ```
   NUXT_ENV_RESTAPI_BASE_URL=
   NUXT_ENV_AUTH0_DOMAIN=
   NUXT_ENV_AUTH0_CLIENT_ID=
   NUXT_ENV_AUTH0_AUDIENCE=
   ```

## Run & Build the Project

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start
```

For detailed explanation on how things work, check out the [documentation](https://v2.nuxt.com/docs/get-started/installation).

Feel free to explore and enhance this NuxtJS project based on your requirements. Happy coding! 🚀

## Live Project

- https://emoview.hcerpl.id
- https://emoview-rest.vercel.app
