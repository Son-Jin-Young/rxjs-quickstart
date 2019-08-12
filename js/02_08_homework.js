const { fromEvent, merge } = rxjs;
const { tap, map, takeUntil, switchMap, first, startWith, withLatestFrom, share } = rxjs.operators;

const $VIEW = document.getElementById('canvas');
const $COLOR = document.getElementById('lineColor');
const $WEIGHT = document.getElementById('lineWeight');
const $CLEAR = document.getElementById('clearCanvas');

const context = $VIEW.getContext('2d');

const SUPPORT_TOUCH = 'ontouchstart' in window;

const EVENTS = {
    start: SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
    move: SUPPORT_TOUCH ? 'touchmove' : 'mousemove',
    end: SUPPORT_TOUCH ? 'touchend' : 'mouseup'
};

const drawStart$ = fromEvent($VIEW, EVENTS.start);
const drawing$ = fromEvent($VIEW, EVENTS.move);
const drawEnd$ = fromEvent($VIEW, EVENTS.end);
const clear$ = fromEvent($CLEAR, 'click');

clear$.subscribe(() => {
    context.clearRect(0,0, $VIEW.width, $VIEW.height);
    context.beginPath();
});

const color$ = fromEvent($COLOR, 'change').pipe(
    startWith(0),
    map((event) => $COLOR.value)
);

const weight$ = fromEvent($WEIGHT, 'change').pipe(
    startWith(0),
    map((event) => $WEIGHT.value)
);

const drag$ = drawStart$.pipe(
    withLatestFrom(color$),
    withLatestFrom(weight$),
    tap((event) => {
        const color = event[0][1];
        const weight = event[1];

        context.beginPath();
        context.moveTo(event[0][0].layerX, event[0][0].layerY);
        context.strokeStyle = color;
        context.lineWidth = weight;
    }),
    switchMap((start) =>
        drawing$.pipe(
            map((move) => {
                context.lineTo(move.layerX, move.layerY);
                context.stroke();
                return move;
            }),
            takeUntil(drawEnd$)
        )
    ),
    share()
);

const drop$ = drag$.pipe(
    switchMap((drag) =>
        drawEnd$.pipe(
            map((event) => drag),
            first()
        )
    )
);

const carousel$ = merge(
    drag$,
    drop$
);

carousel$.subscribe((event) => {
    // console.log(event);
});

function getPageX(obs$) {
    return obs$.pipe(
        map((event) => event)
        // map((event) => SUPPORT_TOUCH ? event.changeTouches[0].pageX : event.pageX)
    );
}