const { Observable, fromEvent, merge } = rxjs;
const { ajax } = rxjs.ajax;
const { tap, map, takeUntil, mergeAll, mergeMap, switchMap, take, first, startWith, withLatestFrom, share } = rxjs.operators;

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
    // map(
    //     (start) => move$.pipe(
    //         // end$ 발생시 complete처리하여 구독 해제
    //         takeUntil(end$)
    //     )
    // ),
    // mergeAll()
    // map과 mergeAll 합성
    // mergeMap((start) => move$.pipe(takeUntil(end$)))
    // start$발생시 move$가 생성됨으로 switchMap으로 변경
    switchMap((start) => {
        return move$.pipe(
            map((move) => move - start),
            takeUntil(end$)
        );
    }),
    // tap(() => console.log('drag!!')),
    share()
);

// drag$.subscribe((distance) => console.log('move - start ::', distance));

const drop$ = drag$.pipe(
    // map((drag) => end$.pipe(first()/* take(1) */)),
    // mergeAll()
    // drag는 distance 값(move - start)
    switchMap((drag) => {
        return end$.pipe(
            map((event) => drag),
            first()
        );
    }),
    withLatestFrom(resize$)
);

// drop$.subscribe((drop) => console.log('drop ::', drop));

const carousel$ = merge(
    drag$,
    drop$
);

carousel$.subscribe(v => console.log('carousel ::', v));

// click의 위치값
function getPageX(obs$) {
    return obs$.pipe(
        map((event) => SUPPORT_TOUCH ? event.changeTouches[0].pageX : event.pageX)
    );
}