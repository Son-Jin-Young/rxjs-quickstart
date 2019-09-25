const { BehaviorSubject, ReplaySubject, AsyncSubject } = rxjs;

// const subject = new BehaviorSubject('start');
// const subject = new ReplaySubject();
// const subject = new ReplaySubject(2);
const subject = new AsyncSubject();

subject.subscribe({
    next: (v) => console.log('observer A ::', v),
    complete: () => console.log('observer A completed')
});

subject.next(1);
subject.next(2);

subject.subscribe({
    next: (v) => console.log('observer B ::', v),
    complete: () => console.log('observer B completed')
});

subject.next(3);
subject.next(4);

subject.complete();

setTimeout(() => {
    subject.next(5);

    subject.subscribe({
        next: (v) => console.log('observer C ::', v),
        complete: () => console.log('observer C completed')
    });
}, 2000);

// new BehaviorSubject('start')
// observer A :: start
// observer A :: 1
// observer A :: 2
// observer B :: 2
// observer A :: 3
// observer B :: 3
// observer A :: 4
// observer B :: 4
// observer A completed
// observer B completed
// observer C completed

// new ReplaySubject();
// observer A :: 1
// observer A :: 2
// observer B :: 1
// observer B :: 2
// observer A :: 3
// observer B :: 3
// observer A :: 4
// observer B :: 4
// observer A completed
// observer B completed
// observer C :: 1
// observer C :: 2
// observer C :: 3
// observer C :: 4
// observer C :: 5
// observer C completed

// new ReplaySubject(2);
// observer A :: 1
// observer A :: 2
// observer B :: 1
// observer B :: 2
// observer A :: 3
// observer B :: 3
// observer A :: 4
// observer B :: 4
// observer A completed
// observer B completed
// observer C :: 4
// observer C :: 5
// observer C completed

// new AsyncSubject();
// observer A :: 4
// observer B :: 4
// observer A completed
// observer B completed
// observer C :: 4
// observer C completed