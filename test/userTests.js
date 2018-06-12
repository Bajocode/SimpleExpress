const expect = require('chai').expect;

const sut = require('../models/User');

describe('sut', () => {
  it('should require a username', (done) => {
    const user = new sut()

    user.validate((err) => {
      expect(err.errors.username).to.exist;
      done();
    });
  });
});
