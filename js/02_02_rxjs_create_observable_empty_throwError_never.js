const { of, empty, throwError, EMPTY, NEVER, merge } = rxjs;
const { map, mergeMap, switchMap, mergeAll, flatMap, switchMapTo} = rxjs.operators;


// TODO: empty의 정확한 동작 확인 필요
// 순차적으로 데이터가 들어온다.
// 데이터가 음수인 경우, 구독을 해지(complete) 한다.
of(1, -2, 3).pipe(
    switchMap(v => v < 0 ? empty() : of(v))
    // switchMap(() => EMPTY)
).subscribe(
    (v) => console.log('empty', v),
    (e) => console.error(e),
    () => console.log('empty complete')
);

empty().subscribe(
    (v) => console.log('empty', v),
    (e) => console.error(e),
    () => console.log('empty complete')
);

// TODO: throwError의 정확한 동작 확인 필요
of(1, -2, 3).pipe(
    switchMap(v => v < 0 ? throwError('음수가 있어부러') : of(v))
).subscribe(
    (v) => console.log('throwError ', v),
    (e) => console.error(e),
    () => console.log('throwError complete')
);

// TODO: NEVER의 정확한 동작 확인 필요
of(1, -2, 3).pipe(
    switchMap(v => v < 0 ? NEVER : of(v))
).subscribe(
    (v) => console.log('never', v),
    (e) => console.error(e),
    () => console.log('never complete')
);
