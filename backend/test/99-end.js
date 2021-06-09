const { expect } = require('chai');
const sql = require('../dist/models/db.js');

describe('Cleaning up', function() {
    it('should disconnect database', function(done) {
        sql.disconnectDatabase().then(result => {
            expect(result).to.be.true;
            done();
        });
    });

});
