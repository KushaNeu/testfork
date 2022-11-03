const config = require('config.json');

const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const { urlencoded } = require('body-parser');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password, id }) {
   
    
    const user = await db.User.scope('withHash').findByPk(id);
    //console.log(user)
    let usernameValidation = false;
    if(username === user.dataValues.username){
        usernameValidation = true;
    }
    const compare = await comparePassword(password, user.dataValues.hash);
    if (user && compare && usernameValidation) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword; //returning the user object without password
    }
}


async function comparePassword(password, hash) {
    const result =  await bcrypt.compare(password, hash);
    return result;
}

/*async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
     return { ...omitHash(user.get()), token };

    return res.status(statusCode).json({ message: You are a valid user });
}*/

async function getAll() {
    return await db.User.findAll();
}

async function getById(accountId, nreq, nres) {
    
     const user = await getUser(accountId);
     console.log("user.username "+id+  " " + user.username);
     
     const base64Credentials =  nreq.headers.authorization.split(' ')[1];
     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
     const [uid, password] = credentials.split(':');

     console.log("const uid "+uid);
            if (user.username!==uid) {
            throw 'You "' + uid + '" are not authorized to check';
        } 
        else{
            return user;
        }
    }

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

async function update(accountId, params) {
    const user = await getUser(accountId);

    //console.log("user.username "+id+  " " + user.username);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(accountId) {
    const user = await db.User.findByPk(accountId);
    
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}