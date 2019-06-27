const { Observable, interval, of, range, fromEvent, from, empty, throwError, NEVER } = rxjs;
const { take, map, mergeMap } = rxjs.operators;

// deprecated
// const number$ = Observable.create((observer) => {
const number$ = new Observable((observer) => {
    try{
        observer.next(1);
        observer.next(2);
        // throw new Error('데이터 전달 도중 오류 발생 !!!');
        observer.next(3);
        observer.complete();
    } catch (e) {
        observer.error(e);
    }
});

number$.subscribe(
    (v) => console.log(v),
    (e) => console.error(e),
    () => console.log('데이터 전달 완료')
);

// const interval$ = new Observable((observer) => {
//     const id = setInterval(() => {
//         observer.next(new Date().toString());
//     }, 1000);
//
//
//     return () => {
//         console.log('interval 제거');
//         clearInterval(id);
//     };
// });
//
// const subscription = interval$.subscribe((v) => console.log(v));
//
// setTimeout(() => {
//      subscription.unsubscribe();
// }, 5000);
//
// // interval 예제 리펙토링
// const reInterval$ = interval(1000).pipe(
//     map(() => new Date().toString()),
//     take(5)
// );
//
// reInterval$.subscribe(
//     (v) => console.log('re: ', v),
//     (e) => console.error(e),
//     () => console.log('refactor interval 제거')
// );

of(10, 20, 30).subscribe(
    (v) => console.log('of', v),
    (e) => console.error(e),
    () => console.log('of complete')
);

range(1, 3).subscribe(
    (v) => console.log('range', v),
    (e) => console.error(e),
    () => console.log('range complete')
);

fromEvent(document, 'click').subscribe(
    (v) => console.log('document click!'),
    (e) => console.error(e),
    () => console.log('range complete')
);

from([10, 20, 30]).subscribe(
    (v) => console.log('from', v),
    (e) => console.error(e),
    () => console.log('from complete')
);

const arguments$ = (function () {
    return from(arguments);
})(1, 2, 3);

arguments$.subscribe(
    (v) => console.log('from arguments', v),
    (e) => console.error(e),
    () => console.log('from complete')
);

const map$ = from(new Map([[1, 2], [2, 4], [4, 8]]));

map$.subscribe(
    (v) => console.log('from map', v),
    (e) => console.error(e),
    () => console.log('from complete')
);

const success$ = from(Promise.resolve(100));
success$.subscribe(
    (v) => console.log('from promise', v),
    (e) => console.error(e),
    () => console.log('from success complete')
);

const failed$ = from(Promise.reject('에러'));
failed$.subscribe(
    (v) => console.log('from promise', v),
    (e) => console.error(e),
    () => console.log('from failed complete')
);

// interval(3000).pipe(take(3)).subscribe(
//     (v) => console.log('interval', v),
//     (e) => console.error(e),
//     () => console.log('interval complete')
// );

// TODO: empty의 정확한 동작 확인 필요
of(1, -2, 3).pipe(
    map(v => v < 0 ? empty() : v)
).subscribe(
    (v) => console.log('empty', v),
    (e) => console.error(e),
    () => console.log('empty complete')
);

// TODO: throwError의 정확한 동작 확인 필요
of(1, -2, 3).pipe(
    map(v => v < 0 ? throwError('음수가 있어부러') : v)
).subscribe(
    (v) => console.log('throwError', v),
    (e) => console.error(e),
    () => console.log('throwError complete')
);

// TODO: NEVER의 정확한 동작 확인 필요
of(1, -2, 3).pipe(
    map(v => v < 0 ? NEVER : v)
).subscribe(
    (v) => console.log('never', v),
    (e) => console.error(e),
    () => console.log('never complete')
);

// 구독할 때마다 독립적으로 데이터를 전달한다.
// const interval$ = interval(1000);
//
// interval$.subscribe((v) => console.log(v));
//
// setTimeout(() => {
//     interval$.subscribe((v) => console.log(v));
// }, 3000);