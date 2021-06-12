const { expect } = require('chai');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;

let chai = require('chai');

chai.use(chaihttp);

describe('Authorization', function() {
    it('should get authorization', function(done) {
        server = serverexp.default()
        chai.request(server)
            .get('/rest/auth')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('name', 'test');
                expect(res.body).to.have.property('isAuthorized', false);
                done();
            });
    });
});