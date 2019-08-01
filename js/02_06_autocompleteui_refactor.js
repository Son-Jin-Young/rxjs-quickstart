const { partition, fromEvent, Observable, interval } = rxjs;
const { ajax } = rxjs.ajax;
const { map, take, mergeMap, switchMap, debounceTime, filter, distinctUntilChanged, tap, catchError, retry, finalize } = rxjs.operators;

const $layer = document.getElementById('suggestLayer');
const $search = document.getElementById('search');
const $loading = document.getElementById('loading');

const request$ = (query) => ajax.getJSON(`https://api.github.com/search/users?q=${query}`);

const keyup$ = fromEvent($search, 'keyup').pipe(
    debounceTime(300),
    map((event) => event.target.value),
    distinctUntilChanged()
);

const [search$, empty$] = partition(
    keyup$,
    ((value) => value.trim() !== '')
);
// const reset$ = keyup$.pipe(
//     filter((value) => value.trim() === ''),
const reset$ = empty$.pipe(
    tap(() => $layer.innerHTML = '')
);

// const user$ = keyup$.pipe(
//     filter((value) => value.trim() !== ''),
const user$ = search$.pipe(
    tap(showLoading),
    // mergeMap((value) => request$(value)),
    switchMap((value) => request$(value)),
    tap(hideLoading),
    catchError((e, origin) => {
        console.log('subscribe 유지');
        return origin;
    }),
    // retry(2),
    // finalize(hideLoading)
);

user$.subscribe(
    (value) => drawLayer(value.items),
    (error) => alert(error.message),
    () => console.log('complete')
);

reset$.subscribe();
    
function drawLayer(items) {
    console.log('drawLayer');
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

// switchMap Marble diagram sample
// const obs$ = new Observable((observer) => {
//     observer.next(1);

//     setTimeout(() => {
//         observer.next(3);
//     }, 3000);

//     setTimeout(() => {
//         observer.next(5);
//     }, 5500);
// });

// obs$.pipe(
//     switchMap((v) => interval(1000).pipe(
//         map((t) => [t + 1, 10 * v]),
//         take(3)
//     ))
// ).subscribe((res) => {
//     console.log(res[0], ':', res[1]);
// });

// finalize 예제
// const interval$ = interval(1000).pipe(
//     take(5),
//     finalize(() => console.log('finalize'))
// ).subscribe(
//     (v) => console.log('interval ::', v),
//     () => console.log('error'),
//     () => console.log('complete')
// );

// setTimeout(() => {
//     interval$.unsubscribe();
// }, 6000);

// partition 예제
// const [odd, even] = partition(
// 	interval(1000),
// 	((x) => x % 2 === 1)
// );

// odd.subscribe((odd) => console.log('odd ::', odd));
// even.subscribe((even) => console.log('even ::', even));