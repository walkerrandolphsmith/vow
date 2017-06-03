export const all = (fns) => fns.reduce((p, fn) => p.then(b => b && fn()), Promise.resolve(true));

export const any = (fns) => fns.reduce((p, fn) => p.then(b => b || fn()), Promise.resolve(false));

export const throttler = async (promises=[], throttle=0) => {
    if (promises === null || promises.length === 0)
        throw "Must provide an array of functions that return promises";
    if (throttle < 1)
        throw "Throttle must be greater than zero.";

    let next = throttle;
    let results = [];

    const getNext = () => next++;

    const nextPromiseHandler = async (result) => { await runNextPromise(promises); return result; };

    const runNextPromise = async (promises) => {
        const myNext = getNext();
        if (myNext < promises.length) {
            try {
                const value = await promises[myNext]().then(nextPromiseHandler);
                results.push(value);
                return value;
            }
            catch (error) {
                throw error
            }
        }
    };

    try {
        const firstN = promises.slice(0, throttle);
        const firstNResults = await Promise.all(firstN.map(p => p().then(nextPromiseHandler)));
        return firstNResults.concat(results);
    }
    catch (error) {
        throw error;
    }
};