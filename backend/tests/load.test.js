import { test } from 'node:test';
import assert from 'node:assert';
import axios from 'axios';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/v1';

const testCoordinates = {
  lat: 23.8103,
  lng: 90.4125,
  date: '2024-03-15',
  method: 'karachi'
};

test('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      axios.get(`${API_BASE_URL}/prayer-times`, {
        params: testCoordinates,
        timeout: 5000
      })
    );

    const startTime = Date.now();
    const responses = await Promise.allSettled(requests);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successful = responses.filter(r => r.status === 'fulfilled').length;
    const failed = responses.filter(r => r.status === 'rejected').length;

    console.log(`\nLoad Test Results:`);
    console.log(`  Total requests: 100`);
    console.log(`  Successful: ${successful}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Requests/sec: ${(100 / (duration / 1000)).toFixed(2)}`);

    assert(successful > 95, 'At least 95% success rate required');
    assert(duration < 10000, 'Should complete in under 10 seconds');
}, { timeout: 30000 });

test('should handle rapid sequential requests', async () => {
    const startTime = Date.now();
    const requests = [];

    for (let i = 0; i < 50; i++) {
      requests.push(
        axios.get(`${API_BASE_URL}/prayer-times`, {
          params: testCoordinates,
          timeout: 5000
        })
      );
    }

    const responses = await Promise.allSettled(requests);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successful = responses.filter(r => r.status === 'fulfilled').length;

    console.log(`\nSequential Load Test Results:`);
    console.log(`  Total requests: 50`);
    console.log(`  Successful: ${successful}`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Avg response time: ${(duration / 50).toFixed(2)}ms`);

    assert.strictEqual(successful, 50);
    assert(duration < 5000, 'Should complete in under 5 seconds');
}, { timeout: 15000 });

test('should handle mixed endpoint load', async () => {
    const endpoints = [
      { url: '/prayer-times', params: testCoordinates },
      { url: '/fasting-times', params: testCoordinates },
      { url: '/sun-times', params: { lat: testCoordinates.lat, lng: testCoordinates.lng, date: testCoordinates.date } },
      { url: '/methods', params: {} }
    ];

    const requests = [];
    for (let i = 0; i < 25; i++) {
      const endpoint = endpoints[i % endpoints.length];
      requests.push(
        axios.get(`${API_BASE_URL}${endpoint.url}`, {
          params: endpoint.params,
          timeout: 5000
        })
      );
    }

    const startTime = Date.now();
    const responses = await Promise.allSettled(requests);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successful = responses.filter(r => r.status === 'fulfilled').length;

    console.log(`\nMixed Endpoint Load Test Results:`);
    console.log(`  Total requests: 25`);
    console.log(`  Successful: ${successful}`);
    console.log(`  Duration: ${duration}ms`);

    assert(successful > 20, 'At least 20 successful requests required');
}, { timeout: 15000 });
