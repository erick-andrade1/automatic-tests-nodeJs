const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');

//Dentro do describe podem ter vários it's:
describe('Authentication', () => {
  //beforeAll: metodo que executa uma vez automaticamente antes de todos os testes do arquivo
  //beforeEach: executa antes de cada um dos testes
  //afterEach: executa depois de cada um dos testes
  //afterAll: executa uma vez depois de todos os testes

  beforeEach(async () => {
    await truncate();
  });

  it('Should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '231',
    });

    expect(response.status).toBe(401);
  });

  it('should return JWT token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes without JWT token', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes with invalid JWT token', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer 123141`);

    expect(response.status).toBe(401);
  });
});
