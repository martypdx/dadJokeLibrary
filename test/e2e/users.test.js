const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const User = require('../../lib/models/User');

describe('User E2E API', () => {

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    const admin = {
        username: 'Josephine',
        password: 'sweettarts',
        role: 'admin'
    };

    const user = {
        username: 'Joline',
        password: 'otherwoman',
        role: 'user'
    };
    
    before(() => dropCollection('users'));

    before(() => {
        return request
            .post('/auth/signup')
            .send(admin)
            .then(checkOk)
            .then(( { body }) => {
                admin._id = body._id;
                assert.ok(body.role);
            });
    });

    before(() => {
        return request
            .post('/auth/signup')
            .send(user)
            .then(checkOk)
            .then(( { body }) => {
                user._id = body._id;
                assert.ok(body.role);
            });
    });

    it('Retrieves users', () => {
        return request.get('/users')
            .then(( { body }) => {
                assert.deepEqual(body[0]._id, admin._id);
                assert.deepEqual(body[1]._id, user._id);
                assert.equal(body.length, 2);
            });
    });
});