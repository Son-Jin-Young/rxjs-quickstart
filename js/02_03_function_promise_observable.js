const { Observable, interval } = rxjs;

function foo(value) {
    console.log(`function: ${value}`);
    return value + 1;
}

foo(1);
foo(1);
foo(1);

// const number$ = interval(1000);

// setTimeout(() => {
//     number$.subscribe((value) => {
//         console.log('Observer 1: ', value);
//     });
// }, 3000);
//
// setTimeout(() => {
//     number$.subscribe((value) => {
//         console.log('Observer 2: ', value);
//     });
// }, 5000);

/**
 * lazy promise
 */
const promise = new Promise((resolve, reject) => {
    console.log('create promise');
    try {
        resolve(1);
    } catch(e) {
        reject('error promise');
    }
});

console.log('-- before then');

promise.then(
    (v) => console.log('promise 1 ::', v),
    (e) => console.error('promise 1 ::', e)
);

console.log('-- after then');

// promise.then(
//     (v) => console.log('promise 2 ::', v),
//     (e) => console.error('promise 2 ::', e)
// );

/**
 * lazy observable
 */
const number$ = new Observable((observer) => {
    console.log('create observable');
    try {
        observer.next(1);
    } catch (e) {
        observer.error('error observable');
    } finally {
        observer.complete();
    }
});

console.log('-- before subscribe');

number$.subscribe(
    (v) => console.log('observable 1 ::', v),
    (e) => console.error('observable 1 ::', e),
    () => console.log('observable 1 :: complete')
);

console.log('-- after subscribe');

// number$.subscribe(
//     (v) => console.log('observable 2 ::', v),
//     (e) => console.error('observable 2 ::', e),
//     () => console.log('observable 2 :: complete')
// );

/**
 * Cancellation promise
 */
const cancelPromise = new Promise((resolve, reject) => {
    try {
        let value = 0;
        setInterval(() => {
            console.log('is going ::', value);
            resolve(value++);
        }, 1000);
    } catch (e) {
        reject('error promise');
    }
});

console.log('== before then');

cancelPromise.then(
    (v) => console.log('promise ::', v)
);

console.log('== after then');

/**
 * Cancellation observable
 */
const obs$ = new Observable((observer) => {
    let id;

    try {
        let value = 0;
        id = setTimeout(() => {
            console.log('is going ::', value);
            observer.next(value++);
        }, 3000);
    } catch (e) {
        observer.error('error observable');
    }
    return () => {
        clearTimeout(id);
        console.log('cancelled');
    };
});

console.log('== before subscribe');

const subscription = obs$.subscribe(
    (v) => console.log('observable 1:', v),
    (e) => console.error('observable 1:', e),
    () => console.log('observable complete')
);

console.log('== after subscribe');

setTimeout(() => {
    subscription.unsubscribe();
}, 4000);
