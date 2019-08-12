const { Observable, fromEvent, merge } = rxjs;
const { ajax } = rxjs.ajax;
const { tap, map, takeUntil, mergeAll, mergeMap, switchMap, take, first, startWith, withLatestFrom, share, scan } = rxjs.operators;

const THRESHOLD = 200;

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
    })
);

carousel$.subscribe(store => {
    console.log('carousel :: ', store);
    translateX(store.to);
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