import { throttler } from './index';
import { expect } from 'chai';

describe('given an array of fns that return promises and a batch size', () => {

    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const promises = expected.map(
        i => () => new Promise(resolve => {
            setTimeout(() => resolve(i), Math.random()*5);
        })
    );

    const numberInFlight = 2;


    it('it should contain all resolved values', async () => {
        const result = await throttler(promises, numberInFlight);
        expect(result.length).to.equal(expected.length);
        expected.forEach(value => {
            expect(result).to.include(value);
        });
    });
});