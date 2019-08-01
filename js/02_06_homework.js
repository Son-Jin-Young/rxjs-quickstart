const { of, partition, fromEvent, Observable, interval, iif } = rxjs;
const { ajax } = rxjs.ajax;
const { map, take, mergeMap, switchMap, debounceTime, filter, distinctUntilChanged, tap, catchError, retry, finalize } = rxjs.operators;

// partition의 경우, 첫번째 인자인 Observable이 전달하는 값으로 true, false를 구분하여 [참, 거짓] 형태의 Observable Array를 반환한다.
// iif의 경우, 첫번째 인자에 조건식이 들어가고, 참인 경우 두번째 인자의 Observable, 거짓인 경우 세번째 인자의 Observable을 반환한다.
// 차이점
// 1. iif는 true, false 중 하나만 반환하므로, 구독할 때 참, 거짓을 구분지어야 동작을 입력해야 한다.

const number$ = interval(1000);

const [even$, odd$] = partition(
    number$,
    (v) => v % 2 === 0
);

// even$.subscribe(v => console.log('even :', v));
// odd$.subscribe(v => console.log('odd :', v));

const true$ = of('even');
const false$ = of('odd');

const iif$ = interval(1000).pipe(
    switchMap((val) => iif(
        () => val % 2 === 0,
        of('even : ' + val),
        of('odd : ' + val) 
    ))
);

iif$.subscribe((v) => console.log('iif$ ::', v));