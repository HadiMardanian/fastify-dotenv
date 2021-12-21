
# fastify-dotenv

### The fastify-dotenv iterates over your .env file and make it a **decorator**.

## Usage/Examples

### 1 ) DEFAULT way
```javascript

const Fastify = require('fastify').default,
    server = Fastify(),
    dotenv = require('@hadimardanian/fastify-dotenv');

server.register(dotenv, {
    path: '/config/.env', // (1)
    decorator: 'env' // (2)
});

server.listen(3000, function () {
    console.log('server is running on port ' + fastify.env);
});

```


  
## Description

- (1) **path** : the "**/**" means the root of project folder. it must be at the beginning of path.
- (2) **decorator** : name it whatever you want, if omitted it will be "**env**" and if set it to *```false```* will not set.
- the "**.env**" file: Its name could be whatever you want. but its format must be plain text and content must be like following:


  
### .env file content

> PORT=3000 <br>
MONGO_CONNECTION=mongodb://localhost/mydb <br>
NODE_ENV=production

And in general ...
> KEY=VALUE
<hr>

### 2 ) Specifying the project directory
```javascript

const Fastify = require('fastify').default,
    server = Fastify(),
    dotenv = require('@hadimardanian/fastify-dotenv');

server.register(dotenv, {
    path: '/config/.env',
    root: '/home/me/Documents/projects/nodeApp'
});

server.listen(3000, function () {
    console.log('server is running on port ' + fastify.env);
});

```
## Description
### Sometime for any reason you start node process somewhere not in the root of the project directory. Then you must manully specify the root of project folder in *```root```* parameter.


  
