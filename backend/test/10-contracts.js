const { expect } = require('chai');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;

let chai = require('chai');

chai.use(chaihttp);

describe('Contracts', function() {
    it('should accept valid sync request for contracts', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/contracts')
            .send([{
                id: 1234,
                description: 'test description',
                start: new Date(2021, 0, 1),
                end: new Date(2021, 11, 31),
                organization: 'Test-Org',
                organizationalUnit: 'OU',
                responsiblePerson: 'Person Name',
                budgets: [{
                    priceCategoryId: 12,
                    priceCategory: 'Preisstufe I',
                    pricePerUnit: 125.5,
                    availableUnits: 100.5,
                    minutesPerDay: 480,
                }, {
                    priceCategoryId: 15,
                    priceCategory: 'Preisstufe II',
                    pricePerUnit: 200.5,
                    availableUnits: 70.8,
                    minutesPerDay: 480,
                }]
            },{
                id: 4536,
                description: 'next contract test description',
                start: new Date(2020, 1, 1),
                end: new Date(2022, 11, 31),
                organization: 'Test-Org',
                organizationalUnit: 'OU',
                responsiblePerson: 'Person Name',
                budgets: [{
                    priceCategoryId: 12,
                    priceCategory: 'Preisstufe I',
                    pricePerUnit: 125.5,
                    availableUnits: 100.5,
                    minutesPerDay: 480,
                }, {
                    priceCategoryId: 15,
                    priceCategory: 'Preisstufe II',
                    pricePerUnit: 200.5,
                    availableUnits: 70.8,
                    minutesPerDay: 480,
                }]
            }])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('created', 2);
                expect(res.body).to.have.property('updated', 0);
                expect(res.body).to.have.property('deleted', 0);
                expect(res.body).to.have.property('unchanged', 0);
                expect(res.body.budgets).to.be.a('object');
                expect(res.body.budgets).to.have.property('created', 4);
                expect(res.body.budgets).to.have.property('updated', 0);
                expect(res.body.budgets).to.have.property('deleted', 0);
                expect(res.body.budgets).to.have.property('unchanged', 0);
                expect(res.body.priceCategories).to.be.a('object');
                expect(res.body.priceCategories).to.have.property('created', 2);
                expect(res.body.priceCategories).to.have.property('updated', 0);
                expect(res.body.priceCategories).to.have.property('deleted', 0);
                expect(res.body.priceCategories).to.have.property('unchanged', 0);
                done();
            });
    });

    it('should not accept sync request for contracts with empty array', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/contracts')
            .send([])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.equal(1);
                expect(res.body.data.errors[0].msg).to.be.equal('Kein Array von Verträgen übergeben');
                done();
            });
    });

    it('should not accept sync request for contracts with object instead of array', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/contracts')
            .send({contracts: []})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.equal(1);
                expect(res.body.data.errors[0].msg).to.be.equal('Kein Array von Verträgen übergeben');
                done();
            });
    });

    it('should not accept sync request for contracts with invalid data', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/contracts')
            .send([{
                id: -1234,
                description: false,
                start: new Date(2021, 0, 1),
                end: new Date(2019, 11, 31),
                organizationalUnit: 1,
                responsiblePerson: 2,
                budgets: [{
                    priceCategoryId: -12,
                    priceCategory: 1,
                    pricePerUnit: -125.5,
                    availableUnits: -101.5,
                    minutesPerDay: -480,
                }, {
                    priceCategoryId: 'acd',
                    priceCategory: 'Preisstufe II',
                    pricePerUnit: '200.5',
                    minutesPerDay: 0,
                }]
            }])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.greaterThan(0);
                const params = res.body.data.errors.map(e => e.param);
                expect(params).to.include('[0]');
                expect(params).to.include('[0].id');
                expect(params).to.include('[0].description');
                expect(params).to.include('[0].organization');
                expect(params).to.include('[0].organizationalUnit');
                expect(params).to.include('[0].responsiblePerson');
                expect(params).to.include('[0].budgets[0].priceCategoryId');
                expect(params).to.include('[0].budgets[1].priceCategoryId');
                expect(params).to.include('[0].budgets[0].priceCategory');
                expect(params).to.include('[0].budgets[0].pricePerUnit');
                expect(params).to.include('[0].budgets[0].availableUnits');
                expect(params).to.include('[0].budgets[1].availableUnits');
                expect(params).to.include('[0].budgets[0].minutesPerDay');
                expect(params).to.include('[0].budgets[1].minutesPerDay');
                done();
            });
    });

    it('should not accept sync request for contracts with invalid data', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/contracts')
            .send([{
                id: 1234,
                description: 'test description',
                start: '2020-11-21',
                end: '01-01-2021',
                organization: 'Test-Org',
                organizationalUnit: 'OU',
                responsiblePerson: 'Person Name',
                budgets: []
            }])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.equal(1);
                const params = res.body.data.errors.map(e => e.param);
                expect(params).to.include('[0].budgets');
                done();
            });
    });

    it('should update an existing contract and prevent SQL injection', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/contracts')
            .send([{
                id: 1234,
                description: 'updated test description',
                start: new Date(2021, 0, 1),
                end: new Date(2021, 11, 31),
                organization: 'Test-Org',
                organizationalUnit: 'OU',
                responsiblePerson: 'Person Name',
                budgets: [{
                    priceCategoryId: 12,
                    priceCategory: 'Preisstufe Ia',
                    pricePerUnit: 125.5,
                    availableUnits: 100.6,
                    minutesPerDay: 480,
                }, {
                    priceCategoryId: 15,
                    priceCategory: 'Preisstufe II',
                    pricePerUnit: 200.5,
                    availableUnits: 70.8,
                    minutesPerDay: 480,
                }]
            },{
                id: 4536,
                description: 'next contract\';\nDELETE FROM BoatExt_Contracts;\nSELECT \'',
                start: new Date(2020, 1, 1),
                end: new Date(2022, 11, 31),
                organization: 'Test-Org1',
                organizationalUnit: 'OU1',
                responsiblePerson: 'Updated Person Name',
                budgets: [{
                    priceCategoryId: 12,
                    priceCategory: 'Preisstufe Ia',
                    pricePerUnit: 125.5,
                    availableUnits: 120.5,
                    minutesPerDay: 480,
                }, {
                    priceCategoryId: 15,
                    priceCategory: 'Preisstufe II',
                    pricePerUnit: 200.5,
                    availableUnits: 70.8,
                    minutesPerDay: 480,
                }]
            }])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('created', 0);
                expect(res.body).to.have.property('updated', 2);
                expect(res.body).to.have.property('deleted', 0);
                expect(res.body).to.have.property('unchanged', 0);
                expect(res.body.budgets).to.be.a('object');
                expect(res.body.budgets).to.have.property('created', 0);
                expect(res.body.budgets).to.have.property('updated', 2);
                expect(res.body.budgets).to.have.property('deleted', 0);
                expect(res.body.budgets).to.have.property('unchanged', 2);
                expect(res.body.priceCategories).to.be.a('object');
                expect(res.body.priceCategories).to.have.property('created', 0);
                expect(res.body.priceCategories).to.have.property('updated', 1);
                expect(res.body.priceCategories).to.have.property('deleted', 0);
                expect(res.body.priceCategories).to.have.property('unchanged', 1);
                done();
            });
    });

    it('should update an existing contract remove a budget and add new one', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/rest/contracts')
            .send([{
                id: 1234,
                description: 'updated test description',
                start: new Date(2021, 0, 1),
                end: new Date(2021, 11, 31),
                organization: 'Test-Org',
                organizationalUnit: 'OU',
                responsiblePerson: 'Person Name',
                budgets: [{
                    priceCategoryId: 12,
                    priceCategory: 'Preisstufe Ia',
                    pricePerUnit: 125.5,
                    availableUnits: 100.6,
                    minutesPerDay: 480,
                }, {
                    priceCategoryId: 16,
                    priceCategory: 'Preisstufe IIa',
                    pricePerUnit: 200.5,
                    availableUnits: 70.8,
                    minutesPerDay: 480,
                }]
            }])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('created', 0);
                expect(res.body).to.have.property('updated', 0);
                expect(res.body).to.have.property('deleted', 0);
                expect(res.body).to.have.property('unchanged', 1);
                expect(res.body.budgets).to.be.a('object');
                expect(res.body.budgets).to.have.property('created', 1);
                expect(res.body.budgets).to.have.property('updated', 0);
                expect(res.body.budgets).to.have.property('deleted', 1);
                expect(res.body.budgets).to.have.property('unchanged', 1);
                expect(res.body.priceCategories).to.be.a('object');
                expect(res.body.priceCategories).to.have.property('created', 1);
                expect(res.body.priceCategories).to.have.property('updated', 0);
                expect(res.body.priceCategories).to.have.property('deleted', 0);
                expect(res.body.priceCategories).to.have.property('unchanged', 1);
                done();
            });
    });

});