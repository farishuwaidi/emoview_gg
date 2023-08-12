# EmoView Backend REST API

Welcome to the ExpressJS project! This project utilizes the Express framework to build a powerful web application. Below, you'll find important instructions for setting up the project based on the branch you are using.

## Environment Variables

Before running the application, you need to configure the following environment variables. Please make sure to set up these variables in your development environment to ensure the smooth operation of the project:

- `NODE_ENV`: Set this to "production" for the production environment.
- `PORT`: The port number on which the server will listen.
- `MONGODB_URL`: The MongoDB connection string for your database.
- `AUTH0_DOMAIN`: The Auth0 domain associated with your Auth0 application.
- `AUTH0_AUDIENCE`: The Auth0 audience URL for your application.
- `AUTH0_CLIENT_ID`: The Auth0 client ID for your application.

You can configure these environment variables in your Nuxt.js project by following these steps:

1. Copy the content from the .env.example file in the root directory of your ExpressJS project.

2. Rename the copied file to .env.

3. Replace the placeholder values in the .env file with the actual values specific to your development environment:

   ```
   NODE_ENV=
   PORT=
   MONGODB_URL=
   AUTH0_DOMAIN=
   AUTH0_AUDIENCE=
   AUTH0_CLIENT_ID=
   ```

   Branch `main`

   ```
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

   Branch `migration`

   ```
   CLOUD_STORAGE_PROJECT_NAME=
   CLOUD_STORAGE_BUCKET_NAME=
   ```

## Setup Cloud Storage

This project has two different cloud storage setups. The `main` branch uses Cloudinary, while the `migration` branch uses Google Cloud Storage.

### Cloudinary Configuration (Branch: main)

If you are using the `main` branch, the application will use **Cloudinary** for image storage. To set up Cloudinary, follow these steps:

1. Sign up for a Cloudinary account at [https://cloudinary.com](https://cloudinary.com).
2. Once you have your account, configure the following environment variables in your `.env` file:

   ```dotenv
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

### Google Cloud Storage Configuration (Branch: migration)

If you are using the migration branch, the application will use Cloud Storage for image storage. To set up Cloud Storage, follow these steps:

1. Set up a project on Google Cloud Platform (GCP) and enable the Cloud Storage API.
2. Create a bucket in Cloud Storage to store the images.
3. Configure the following environment variables in your .env file:

   ```dotenv
   CLOUD_STORAGE_PROJECT_NAME=your-gcp-project-name
   CLOUD_STORAGE_BUCKET_NAME=your-cloud-storage-bucket-name
   ```

## Running the Project

Once you have set up the appropriate environment variables based on your branch, you can run the ExpressJS project using the following command:

```bash
# install dependencies
$ npm install

# start with hot reload
$ npm run dev

# start for production
$ npm run start
```

The application will be accessible at `http://localhost:{PORT}`.

Feel free to explore and enhance this ExpressJS project based on your requirements. Happy coding! 🚀

## Live Project

- https://api.emoview.hcerpl.id
- https://api-fer-rest.fly.dev