const { partition, fromEvent, Observable, interval, Subject } = rxjs;
const { ajax } = rxjs.ajax;
const { map, take, mergeMap, switchMap, debounceTime, filter, distinctUntilChanged, tap, catchError, retry, finalize, multicast, publish, refCount, share } = rxjs.operators;

const $layer = document.getElementById('suggestLayer');
const $search = document.getElementById('search');
const $loading = document.getElementById('loading');

const request$ = (query) => ajax.getJSON(`https://api.github.com/search/users?q=${query}`);

// Subject test
// const subject = new Subject();

// subject.subscribe((v) => {
//     console.log('observer A ::', v)
// });

// subject.next(1);

// subject.subscribe((v) => {
//     console.log('observer B ::', v)
// });

// subject.next(2);

const keyup$ = fromEvent($search, 'keyup').pipe(
    debounceTime(300),
    map((event) => event.target.value),
    distinctUntilChanged(),
    tap((v) => console.log("from keyup$", v)),
    // Subject를 받아 ConnectableObservable로 변환한다.
    // multicast(new Subject())
    // 두개를 합한게 share이다
    // publish(),
    // refCount()
    share()
);

const [search$, empty$] = partition(
    // subject,
    keyup$,
    ((value) => value.trim() !== '')
);

search$.pipe(
    tap(showLoading),
    switchMap((value) => request$(value)),
    tap(hideLoading),
    retry(2),
    finalize(hideLoading),
    tap((v) => console.log("to user$", v))
).subscribe(
    (value) => drawLayer(value.items),
    (error) => alert(error.message),
    () => console.log('complete')
);

empty$.pipe(
    tap(() => $layer.innerHTML = ''),
    tap((v) => console.log("to reset$", v))
).subscribe();

// ConnectableObservable이 되면서 제거
// keyup$.subscribe(subject);

// refCount를 사용하면 자동으로 reference를 관리해주므로 제거
// keyup$.connect();
    
function drawLayer(items) {
    $layer.innerHTML = items.map((user) => {
        return `<li class="user">
<img src="${user.avatar_url}" alt="" width="50px" height="50px"/>
<p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
</li>`;
    }).join('');
}

function showLoading() {
    $loading.style.display = 'block';
}

function hideLoading() {
    $loading.style.display = 'none';
}

// ConnectableObservable 예제
const number$ = interval(1000).pipe(tap((v) => console.log('interval val ::', v)));
const connectable$ = number$.pipe(publish(), refCount());

let connectSubscription, sub1, sub2;

sub1 = connectable$.subscribe((v) => console.log('observer 1 ::', v));
// refCount를 사용하면 자동으로 reference를 관리해주므로 제거
// connectSubscription = connectable$.connect();

setTimeout(() => {
    sub2 = connectable$.subscribe((v) => console.log('observer 2 ::', v));
}, 1100);

setTimeout(() => {
    console.log('observer 1 is unsubscribe');
    sub1.unsubscribe();
}, 2100);

setTimeout(() => {
    console.log('observer 2 is unsubscribe');
    sub2.unsubscribe();
    // refCount를 사용하면 자동으로 reference를 관리해주므로 제거
    // console.log('connectableObservable is unsubscribe');
    // connect를 해지하지 않으면 공유하고 있는 Observable을 계속 동작한다.
    // connectSubscription.unsubscribe();
}, 3100);
