const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt-nodejs');

const sut = require('../models/User');

describe('User', () => {

  let emptyUser;
  let user;

  beforeEach(() => {
    emptyUser = new sut();
    user = new sut({
      username: 'foo',
      password: 'bar',
      displayName: 'baz',
      bio: 'qux',
    });
  });

  afterEach(() => {
    emptyUser = null;
    user = null;
  })

  it('should require a username', (done) => {
    emptyUser.validate((err) => {
      expect(err.errors.username).to.exist;
      done();
    });
  });

  it('should require a password', (done) => {
    emptyUser.validate((err) => {
      expect(err.errors.password).to.exist;
      done();
    });
  });

  it('should set all properties correctly', (done) => {
    expect(user.username).to.equal('foo');
    expect(user.password).to.equal('bar');
    expect(user.displayName).to.equal('baz');
    expect(user.bio).to.equal('qux');
    done();
  });

  it('should return a username when no displayName set', (done) => {
    emptyUser.username = 'foo';
    expect(emptyUser.getName()).to.equal('foo');
    done();
  });

  it('should return a displayname when displayName set', (done) => {
    expect(user.getName()).to.equal('baz');
    done();
  });
});
