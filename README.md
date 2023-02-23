# Project-NC-News

## Link for hosted version

https://project-nc-news-db.onrender.com

GET https://project-nc-news-db.onrender.com/api - Returns all available endpoints.

## Summary

Project-NC-News is a web application that provides news articles and comments on various topics. Users can read articles, post comments, and vote on articles and comments.

## Technologies Used

Node.js (v14.18.1)

PostgreSQL (v13.5)

## Installation

To run the Project-NC-News application, you will need to have Node.js and PostgreSQL installed on your machine.

1. Clone the repository: git clone https://github.com/IzaanD98/Project-NC-News.git

2. Navigate to the project directory: cd Project-NC-News

3. Install the dependencies:

   ```
   npm install pg;
   npm install dotenv;
   npm install express;
   ```

4. Seed Local Database;

   ```
   npm run setup-dbs
   npm run seed
   ```

5. To connect the two databases, you need to create two files that allow access to environment variables: ".env.test" and ".env.development".

   These files should contain the following lines:

   ```
   PGDATABASE=nc_news_test ---> in .env.test
   PGDATABASE=nc_news  ---> in .env.development
   ```

   The first line sets the database name for the test environment, while the second line sets the database name for the development environment. With these files in place, your application should be able to connect to the appropriate database depending on the environment in which it is running.

6. To run tests you will need development dependencies installed:

   ```
   npm install supertest -D;
   npm install jest -D;
   npm install jest-sorted -D;
   npm install pg-format -D;
   ```

7. Use the following command to run the tests:

   ```
   npm test
   ```
