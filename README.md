# Northcoders News API

## Connection to Database

To connect the two databases, you need to create two files that allow access to environment variables: ".env.test" and ".env.development".

These files should contain the following lines:

```
PGDATABASE=nc_news_test
PGDATABASE=nc_news
```

The first line sets the database name for the test environment, while the second line sets the database name for the development environment. With these files in place, your application should be able to connect to the appropriate database depending on the environment in which it is running.
