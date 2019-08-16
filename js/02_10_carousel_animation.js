const { interval, of, Observable, fromEvent, merge, concat, asyncScheduler, asapScheduler, animationFrameScheduler, defer } = rxjs;
const { tap, map, takeUntil, takeWhile, mergeAll, mergeMap, switchMap, take, first, startWith, withLatestFrom, share, scan, reduce, subscribeOn, observeOn } = rxjs.operators;

const THRESHOLD = 200;
const DEFAULT_DURATION = 300;

const $VIEW = document.getElementById('carousel');
const $CONTAINER = document.querySelector('.container');
const PANEL_COUNT = document.querySelectorAll('.panel').length;

const SUPPORT_TOUCH = 'ontouchstart' in window;

const EVENTS = {
    start: SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
    move: SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
    end: SUPPORT_TOUCH ? 'touchend' : 'mouseup'
};

const start$ = fromEvent($VIEW, EVENTS.start).pipe(
    getPageX
);
const move$ = fromEvent($VIEW, EVENTS.move).pipe(
    getPageX
);
const end$ = fromEvent($VIEW, EVENTS.end);
const resize$ = fromEvent(window, 'resize').pipe(
    startWith(0),
    map((event) => $VIEW.clientWidth)
);

resize$.subscribe((width) => console.log('resize window ::', width));

const drag$ = start$.pipe(
    switchMap((start) => {
        return move$.pipe(
            map((move) => move - start),
            map((distance) => ({distance})),
            takeUntil(end$)
        );
    }),
    share()
);

const drop$ = drag$.pipe(
    switchMap((drag) => {
        return end$.pipe(
            map((event) => drag),
            first()
        );
    }),
    withLatestFrom(resize$, (drag, size) => {
        return {...drag, size};
    })
);

const carousel$ = merge(
    drag$,
    drop$
).pipe(
    scan((store, {distance, size}) => {
        const updateStore = {
            from: -(store.index * store.size) + distance
        };

        if (size === undefined) {
            // drag
            updateStore.to = updateStore.from;
        } else {
            // drop
            let tobeIndex = store.index;

            if (Math.abs(distance) >= THRESHOLD) {
                tobeIndex = distance < 0 ? Math.min(tobeIndex + 1, PANEL_COUNT - 1) : Math.max(tobeIndex - 1, 0);
            }

            updateStore.index = tobeIndex;
            updateStore.to = -(tobeIndex * size);
            updateStore.size = size;
        }

        return {...store, ...updateStore};
    }, {
        from: 0,
        to: 0,
        index: 0,
        size: 0
    }),
    switchMap(({from, to}) => from === to ? of(to) : animation(from, to, DEFAULT_DURATION))
);

carousel$.subscribe(store => {
    translateX(store);
});

// click의 위치값
function getPageX(obs$) {
    return obs$.pipe(
        map((event) => SUPPORT_TOUCH ? event.changeTouches[0].pageX : event.pageX)
    );
}

function translateX(posX) {
    $CONTAINER.style.transform = `translate3d(${posX}px, 0, 0)`;
}

/**************************************************** 예제 */
// const obs$ = of('A', 'B', 'C').pipe(
//     tap(v => console.log(v, '데이터 처리1')),
//     tap(v => console.log(v, '데이터 처리2')),
//     tap(v => console.log(v, '데이터 처리3')),
//     tap(v => console.log(v, '데이터 처리4')),
//     observeOn(asyncScheduler),
//     subscribeOn(asyncScheduler)
// );
// const obs$ = of('A', 'B', 'C').pipe(
//     tap(v => console.log(v, '데이터 처리1')),
//     tap(v => console.log(v, '데이터 처리2')),
//     observeOn(asyncScheduler),
//     tap(v => console.log(v, '데이터 처리3')),
//     tap(v => console.log(v, '데이터 처리4')),
//     observeOn(asapScheduler),
//     tap(v => console.log(v, '데이터 처리5')),
//     tap(v => console.log(v, '데이터 처리6')),
// );

// console.log('subscribe 이전');
// setTimeout(() => {
//     const start = new Date().getTime();
//     console.log('1초 후 subscribe');
//     obs$.subscribe(v => console.log('observer received ::', v));
//     console.log('subscribe 이후', new Date().getTime() - start, 'ms');
// }, 1000);

// const DURATION = 300;

// const from = 100;
// const to = 500;

function animation(from, to, duration) {
    return defer(() => {
        const scheduler = animationFrameScheduler;
        const start = scheduler.now();
        const interval$ = interval(0, scheduler).pipe(
            map(() => (scheduler.now() - start) / duration),
            takeWhile(rate => rate <= 1)
        );
        
        return concat(interval$, of(1)).pipe(
            map(rate => from + (to - from) * rate)
        );
    });
}
// const animation$ = animation(from, to, DURATION);

// setTimeout(() => {
//     animation$.subscribe((pos) => console.log('animation$', pos));
// }, 500);