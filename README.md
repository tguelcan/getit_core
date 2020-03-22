<p align="center">
 <img src="https://raw.githubusercontent.com/tguelcan/getit_core/master/logo.png" width="400">
</p>

[![Build Status](https://travis-ci.com/tguelcan/restbest.svg?branch=master)](https://travis-ci.com/tguelcan/restbest) 
[![Coverage Status](https://coveralls.io/repos/github/tguelcan/restbest/badge.svg?branch=master)](https://coveralls.io/github/tguelcan/restbest?branch=master) 
[![dependencies Status](https://david-dm.org/tguelcan/restbest/status.svg)](https://david-dm.org/tguelcan/restbest) 
[![devDependencies Status](https://david-dm.org/tguelcan/restbest/dev-status.svg)](https://david-dm.org/tguelcan/restbest?type=dev) 
[![Maintainability](https://api.codeclimate.com/v1/badges/5945843900d6de10a55c/maintainability)](https://codeclimate.com/github/tguelcan/restbest/maintainability)
[![Heroku CI Status](https://heroku-pass-ci.herokuapp.com/last.svg)](https://dashboard.heroku.com/pipelines/0e6548a4-79df-4655-b19a-724b3c009aa3/tests)

**getit_core powers the GET IT! (https://devpost.com/software/get-it-5otumj) application . It is based on NodeJS, Restify, Mongodb and Mongoose.**

- RESTful - It follows the best practices
- BABEL7 - with ESLint
- User registration API - Using [restify-jwt-community](https://github.com/frbuceta/restify-jwt-community)
- Listing query strings - q, page, limit, fields etc. already provided by [restify-mongoose](https://github.com/saintedlama/restify-mongoose)
- Standard error responses - [restify-errors](https://github.com/restify/errors)
- Unit and integration tests - Using Jest
- Continuous integration support - Using Travis CI
- API docs generator - Using apidoc

# #️⃣ getit_core 101

Use the API to display information on who needs what in your local area. The simplest use-case is a GET Request that takes your postal code as a parameters.

/api/entries?postcode=64319&type=articles

You can also configure how many results you want to see at max

/api/entries?postcode=64319&type=articles&count=42


# #️⃣ Commands you can use

After you clone this repository, these commands are available in `package.json`.
You can use npm or yarn.

```bash
$ yarn test # test using Jest
$ yarn run test:coverage # test and open the coverage report in the browser
$ yarn run lint # lint using ESLint
$ yarn run dev # run the API in development mode
$ yarn run docs # generate API docs
$ yarn run build # build into /lib
$ yarn run serve # serve from /lib
$ yarn run generate # generate a new /api endpoint or sercice
```

# 🚀 Getting started - Playing locally
## Easy to use with npx (recommended)

1. Download and install
```bash
$ npx restbest
```

2. You will need to install and run [MongoDB](https://www.mongodb.com/) in another terminal instance.
```bash
$ mongod
```

3. Go to the /restbest folder and run the server in development mode.
```bash
$ yarn run dev
Restify server listening on http://0.0.0.0:9000, in development mode
```

## Manual Setup
1. Clone the repository and install dependencies with 'yarn' or 'npm install'
```bash
$ git clone https://github.com/tguelcan/restbest
$ yarn
```

2. rename the *.env.example* file to *.env*

3. You will need to install and run [MongoDB](https://www.mongodb.com/) in another terminal instance.
```bash
$ mongod
```

4. Run the server in development mode.
```bash
$ yarn run dev
Restify server listening on http://0.0.0.0:9000, in development mode
```

*And voila! We have connected our restful backend application!*

<img src="https://media.giphy.com/media/3o8dFn5CXJlCV9ZEsg/giphy-downsized.gif" width="400">

# 🤖 Use the Generator
```bash
$ yarn run generate
? What do you want to generate? (Use arrow keys)
❯ service - Create a new service
  api endpoint - Create a new api endpoint (/api/endpoint)
```

## Service Generator
```bash
? name of the service
```
You can choose the type of the service
```bash
? ? which kind of service you want to generate? (Use arrow keys)
❯ MIDDLEWARE
```
It generates the following files 
```bash
✔  ++ /src/services/yourMiddleware/index.js
```

## Api Generator
You can choose the endpoint methods
```bash
> to toggle all, <i> to invert selection)
❯◯ GET
 ◯ POST
 ◯ PATCH
 ◯ DELETE
```
It generates the following files 
```bash
✔  ++ /test/api/+article.test.js
✔  ++ /src/api/+article/index.js
✔  ++ /src/api/+article/model.js
✔  ++ /src/api/+article/controller.js
```

## Doc Generator

```bash
$ yarn run docs
```

It generates the following files 
```bash
✔  ++ /docs/index.html
✔  ++ API.md
```

# 🚀 Deployment

## Heroku example

```bash
$ heroku create
$ heroku config:set APP_NAME=yourappname MASTER_KEY=changeMeMasterKey123 JWT_SECRET=changeMe123
$ heroku addons:create mongolab
$ git push heroku master
$ heroku open
```

# 📝 Todo
- Add Auth
    - Local Auth ✔️
    - Roles ✔️
    - Social Auth 
- Add generator ✔️

## License

[MIT](https://opensource.org/licenses/MIT)
