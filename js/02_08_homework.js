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

const drawStart$ = fromEvent($VIEW, EVENTS.start).pipe(getLayerXY);
const drawing$ = fromEvent($VIEW, EVENTS.move).pipe(getLayerXY);
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
        context.beginPath();
        context.moveTo(event[0][0].x, event[0][0].y);
        context.strokeStyle = event[0][1];
        context.lineWidth = event[1];
    }),
    // withLatestFrom(color$, weight$, (event, color, weight) => {
    //     return {x: event.x, y: event.y, color, weight};
    // }),
    // tap((event) => {
    //     context.beginPath();
    //     context.moveTo(event.x, event.y);
    //     context.strokeStyle = event.color;
    //     context.lineWidth = event.weight;
    // }),
    switchMap((start) =>
        drawing$.pipe(
            map((move) => {
                context.lineTo(move.x, move.y);
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

const draw$ = merge(
    drag$,
    drop$
);

draw$.subscribe();

function getLayerXY(obs$) {
    return obs$.pipe(
        // map((event) => event)
        map((event) => {
            return {
                x: SUPPORT_TOUCH ? event.changeTouches[0].layerX : event.layerX,
                y: SUPPORT_TOUCH ? event.changeTouches[0].layerY : event.layerY
            };
        })
    );
}