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
            .send({
                contractId: 1234,
                deliverables: [{
                    id: 23456,
                    version: 1,
                    date: '2021-11-01',
                    duration: 5,
                    key: '012341000000000XXX',
                    priceCategoryId: 12,
                }, {
                    id: 23457,
                    version: 1,
                    date: '2021-11-02',
                    duration: 5,
                    priceCategoryId: 12,
                }],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('created', 2);
                expect(res.body).to.have.property('updated', 0);
                expect(res.body).to.have.property('deleted', 0);
                expect(res.body).to.have.property('unchanged', 0);
                done();
            });
    });

    it('should not accept sync request for object', function(done) {
        chai.request(server)
            .post('/rest/deliverables')
            .send({
                contractId: 1234,
                deliverables: {
                    id: 23456,
                    version: 1,
                    date: '2021-11-01',
                    duration: 5,
                    key: '012341000000000XXX',
                    priceCategoryId: 12,
                },
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
        chai.request(server)
            .post('/rest/deliverables')
            .send({
                contractId: 'x',
                deliverables: [{
                    id: 'x',
                    version: '1x',
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
                }],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.greaterThan(1);
                const params = res.body.data.errors.map(e => e.path);
                expect(params).to.include('contractId');
                expect(params).to.include('deliverables[0].id');
                expect(params).to.include('deliverables[0].version');
                expect(params).to.include('deliverables[0].date');
                expect(params).to.include('deliverables[0].duration');
                expect(params).to.include('deliverables[0].key');
                expect(params).to.include('deliverables[0].priceCategoryId');
                expect(params).to.include('deliverables[1].id');
                expect(params).to.include('deliverables[1].version');
                expect(params).to.include('deliverables[1].date');
                expect(params).to.include('deliverables[1].duration');
                expect(params).to.include('deliverables[1].key');
                expect(params).to.include('deliverables[1].priceCategoryId');
                expect(params).to.include('deliverables[2].key');
                expect(params).not.to.include('deliverables[3].key');
                done();
            });
    });

    it('should accept valid sync request for deliverables and upate 2 items', function(done) {
        chai.request(server)
            .post('/rest/deliverables')
            .send({
                contractId: 1234,
                deliverables: [{
                    id: 23456,
                    version: 1,
                    date: '2021-11-01',
                    duration: 4,
                    key: '012341000000000XXX',
                    priceCategoryId: 12,
                }, {
                    id: 23457,
                    version: 1,
                    date: '2021-11-02',
                    duration: 4,
                    priceCategoryId: 12,
                }],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('created', 0);
                expect(res.body).to.have.property('updated', 2);
                expect(res.body).to.have.property('deleted', 0);
                expect(res.body).to.have.property('unchanged', 0);
                done();
            });
    });

});