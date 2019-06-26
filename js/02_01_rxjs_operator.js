const { fromEvent } = rxjs;
const { pluck } = rxjs.operators;

const eventHandler = event => {
    console.log('pure javascript event :: ', event.currentTarget);
};

document.addEventListener('click', eventHandler);
const click$ = fromEvent(document, 'click').pipe(
    // 해당 속성이 없는 경우 undefined
    pluck('currentTarget')
);
const observer = event => {
    console.log('rxjs event :: ', event.currentTarget);
};

const pluckObserver = currentTarget => {
    console.log('rxjs event pluck :: ', currentTarget);
};

// click$.subscribe(observer);
click$.subscribe(pluckObserver);

