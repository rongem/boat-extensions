const { expect } = require('chai');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;

let chai = require('chai');

chai.use(chaihttp);

describe('Deliverables', function() {
    it('should accept valid sync request for deliverables', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/deliverables')
            .send([{
                id: 23456,
                version: 1,
                contract: 1234,
                date: new Date('2021-11-01'),
                duration: 5,
                key: '012341000000000XXX',
                priceCategoryId: 12,
            }, {
                id: 23457,
                version: 1,
                contract: 1234,
                date: new Date('2021-11-02'),
                duration: 5,
                priceCategoryId: 12,
            }])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should not accept sync request for object', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/deliverables')
            .send({
                id: 23456,
                version: 1,
                contract: 1234,
                date: new Date('2021-11-01'),
                duration: 5,
                key: '012341000000000XXX',
                priceCategoryId: 12,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.equal(1);
                expect(res.body.data.errors[0].msg).to.be.equal('Kein Array von Leistungszeiten übergeben');
                done();
            });
    });

    it('should not accept sync request for object', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/deliverables')
            .send([{
                id: 'x',
                version: '1x',
                contract: 'x',
                date: 'xyz',
                duration: 'x',
                key: '0123410000XX',
                priceCategoryId: 'x',
            }, {
                key: 1
            }, {
                key: '111111111111111111'
            }, {
                key: ''
            }])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.greaterThan(1);
                const params = res.body.data.errors.map(e => e.param);
                expect(params).to.include('[0].id');
                expect(params).to.include('[0].version');
                expect(params).to.include('[0].date');
                expect(params).to.include('[0].duration');
                expect(params).to.include('[0].key');
                expect(params).to.include('[0].priceCategoryId');
                expect(params).to.include('[1].id');
                expect(params).to.include('[1].version');
                expect(params).to.include('[1].date');
                expect(params).to.include('[1].duration');
                expect(params).to.include('[1].key');
                expect(params).to.include('[1].priceCategoryId');
                expect(params).to.include('[2].key');
                expect(params).not.to.include('[3].key');
                done();
            });
    });

});