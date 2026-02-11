import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Order from '../models/Order';

describe('Order API', () => {
  let orderId;

  beforeAll(async () => {
    await Order.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('POST /api/orders - Validation Failure', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [], totalAmount: 0 });
    
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/orders - Success', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [{ productName: 'Truffle Burger', quantity: 1, price: 15.99 }],
        totalAmount: 15.99,
        deliveryAddress: '123 Tech Lane'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.order).toHaveProperty('ecoData');
    orderId = res.body.order._id;
  });

  it('PATCH /api/orders/:id/status - Update Status', async () => {
    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: 'out_for_delivery' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('out_for_delivery');
    expect(res.body.deliveryMetrics.qualityScore).toBeDefined();
  });

  it('GET /api/orders/:id - Retrieve Order', async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(orderId);
  });
});