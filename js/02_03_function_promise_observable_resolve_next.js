/**
 * Q: 결정된 상태값만 반환하기 때문에 동일한 값을 계속 받을 수 있는 것이다.
 * A: 추측
 * promise는 resolve가 처음 발생한 시점의 값만을 반환한다.
 * observable은 next 되는 시점의 값들을 계속 발행하기 때문에 구독하는 곳에서 결정된 상태값이 아닌 next 된 값을 반환한다.
 */

const { Observable } = rxjs;

/**
 * lazy promise
 */
const promise = new Promise((resolve, reject) => {
    console.log('create promise');
    try {
        resolve(1);
        resolve(10);
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

/**
 * lazy observable
 */
const number$ = new Observable((observer) => {
    console.log('create observable');
    try {
        observer.next(1);
        observer.next(10);
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

number$.subscribe(
    (v) => console.log('observable 1 ::', v),
    (e) => console.error('observable 1 ::', e),
    () => console.log('observable 1 :: complete')
);

console.log('-- after subscribe');
