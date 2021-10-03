const fs = require('fs');
const path = require('path');
const mkErr = require('fastify-error');
const ROOT_DIR = path.resolve('.');
const Plugin = require('fastify-plugin');


async function f(fastify, options, done) {
    let PATH = ROOT_DIR + options.path;
    if (!fs.existsSync(PATH) || !fs.statSync(PATH).isFile())
        throw new mkErr('DOTENV_NOT_FOUND', `No file found in this path:\n${options.path}`, 404)();
    const env = fs.createReadStream(PATH, { highWaterMark: 1 });

    let obj = {};
    let k = '';
    let v = '';
    env.on('end', () => {
        if (!k) return;
        obj[k] = v;
        process.env[k] = v;
        v = k = '';
        env.close()
    })
    for await (let c of env) {
        c = c.toString('utf8')
        switch (c) {
            case '\n': {
                obj[k] = v;
                process.env[k] = v;
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
    
    fastify.decorate(options.decorator || 'env', obj);

    done(null);

}
module.exports = Plugin(f, {
    name: 'fastify-dotenv',
    version: '1.0.0'
});;
