const request = require('supertest');
const app = require('../../test/setup');

const payload = require('../../test/payloads/user.payload');

const User = require('../../models/userModel');
const Referral = require('../../models/referralModel');

// beforeEach(async () => await User.deleteMany());

beforeAll(() => {});

describe('User Authentication', () => {
  describe('User Login', () => {
    test('Given email was ommited', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: '', password: 'test1234' });

      expect(res.statusCode).toBe(401);
    });

    test('Given password was ommited', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'ced@ced.com', password: '' });

      expect(res.statusCode).toBe(401);
    });

    test('Given user with provided email does not exist', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'cedr@ced.com', password: 'test1234' });

      expect(res.statusCode).toBe(401);
    });

    test('Given passwod is incorrect', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'ced@ced.com', password: 'test12345' });

      expect(res.statusCode).toBe(401);
    });

    test('Given password and email are correct', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'cedard@gmail.com', password: 'test1234' });

      expect(res.statusCode).toBe(200);
    });
  });

  describe('User Sign Up', () => {
    describe('Given email is invalid', () => {
      test('It should return 500', async () => {
        const res = await request(app)
          .post('/api/v1/users/signup')
          .send({ email: 'dhde7es', password: 'test1234' });

        expect(res.statusCode).toBe(500);
      });
    });

    describe('Given email already exists', () => {
      test('It should return 500', async () => {
        const res = await request(app)
          .post('/api/v1/users/signup')
          .send(payload);

        expect(res.statusCode).toBe(500);
      });
    });

    describe('Given passwords do not match', () => {
      test('It should return 500', async () => {
        const res = await request(app)
          .post('/api/v1/users/signup')
          .send({ ...payload, password: 'test', email: 'new@new.com' });

        expect(res.statusCode).toBe(500);
      });
    });

    describe('Given all fields are valid', () => {
      test('It should return 500', async () => {
        const res = await request(app)
          .post('/api/v1/users/signup')
          .send({ ...payload, email: 'new@new.com' });

        expect(res.statusCode).toBe(201);
      });
    });

    describe('Given the user used a refferal link', () => {
      test('It should return 500', async () => {
        const { referralLink } = await User.findOne();

        const res = await request(app)
          .post('/api/v1/users/signup')
          .send({ ...payload, email: 'new@new2.com', referralLink });

        const { data } = res.body.data;

        const referral = await Referral.findOne({ downline: data.id });

        expect(res.statusCode).toBe(201);
        expect(referral).toBeDefined();
      });
    });
  });
});
