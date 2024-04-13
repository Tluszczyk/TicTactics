import supertest from 'supertest';

import { APIService } from '../services/APIService/APIService';
import { describe, expect } from '@jest/globals';
import * as types from '../services/types';

import * as dotenv from 'dotenv';
dotenv.config();

const apiService = new APIService(2137);
apiService.start();

const app = apiService.getApp();

describe('user happy path', () => {
    const newUser = {
        name: 'testuser',
        password: 'testpassword',
    } as types.Credentials;

    it('should create a user', async () => {
        let response = await supertest(app).post('/user').send(newUser)
        expect(response.status).toEqual(200);
    });

    it('should get a user', async () => {
        let users = await supertest(app).get(`/user?name=${newUser.name}`) as types.UserPublicData[];
        users.forEach(user => {
            expect(user.username).toEqual(newUser.name);
        })
    });

    it('should delete a user', async () => {
        let users = await supertest(app).get(`/user?name=${newUser.name}`) as types.UserPublicData[];
        users.forEach(async user => {
            let response = await supertest(app).delete(`/user?userId=${user.userId}`).send();
            expect(response.status).toEqual(200);
        })
    });

    it('should fail to get a user', async () => {
        let getResponse = await supertest(app).get(`/user?name=${newUser.name}`);
        expect(getResponse.status).toEqual(404);
    });
})


