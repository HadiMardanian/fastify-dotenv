const fs = require('fs'),
    path = require('path'),
    ROOT_DIR = path.resolve('.');

async function Plugin(
    fastify,
    { root, path, decorator },
    done
) {
    const PATH = root ? root + path : ROOT_DIR + path;
    if (!fs.existsSync(PATH) || !fs.statSync(PATH).isFile()) {
        console.log(`[ fastify-dotenv ]: The file ${PATH} not found`);
        return done();
    }

    const env = fs.createReadStream(PATH, { highWaterMark: 1 });
    let obj = {},
        k = '',
        v = '';

    env.on('end', () => {
        if (!k) return;
        obj[k] = isNaN(v) ? v : +v;
        process.env[k] = isNaN(v) ? v : +v;
        v = k = '';

        env.close()
    });

    for await (let c of env) {
        c = c.toString('utf8')
        switch (c) {
            case '\n': {
                obj[k] = isNaN(v) ? v : +v;
                process.env[k] = isNaN(v) ? v : +v;
                v = k = '';
                break;
            }
            case '=': {
                k = v;
                v = '';
                break;
            }
            default: {
                v += c;
            }
        }
    }
    
    if(decorator !== false) {
        fastify.decorate(decorator || 'env', obj);
    }
    

    done();

}
module.exports = require('fastify-plugin')(Plugin);
