const { fromEvent, from, zip, of, interval, merge, Observable, NEVER } = rxjs;
const { ajax } = rxjs.ajax;
const { map, pluck, mergeAll, mergeMap, switchMap, take, debounceTime, filter, distinctUntilChanged, tap } = rxjs.operators;

const keyup$ = fromEvent(document.getElementById('search'), 'keyup');

const request$ = (query) => ajax.getJSON(`https://api.github.com/search/users?q=${query}`);
// const request$ = from(fetch('https://api.github.com/search/users?q=sculove').then((res) => res.json()));

// request$.subscribe(
//     (data) => console.log('data ::', data)
// );

const layer = document.getElementById('suggestLayer');

const user$ = keyup$.pipe(
    // 일정 시간동안 반복되는 요청을 방지, 설정 시간이 지나기 이전에는 후 동작을 하지 않는다.
    debounceTime(300),
    map((event) => event.target.value),
    // 다른 방식
    // pluck('target', 'value')

    distinctUntilChanged(),

    // filter((value) => value.trim() !== ''),
    // tap(() => layer.innerHTML = ''),

    switchMap((value) => {
        if (value.trim() !== '') {
            return of(value);
        } else {
            layer.innerHTML = '';
            return NEVER;
        }
    }),

    // map((value) => request$(value)),
    // mergeAll()
    // mergeMap = map + mergeAll
    mergeMap((value) => request$(value))
);

user$.subscribe(
    (value) => drawLayer(value.items)
);

function drawLayer(items) {
    layer.innerHTML = items.map((user) => {
        return `<li class="user">
<img src="${user.avatar_url}" alt="" width="50px" height="50px"/>
<p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
</li>`;
    }).join('');
}

// mergeMap(i => 10*i--10*--10*i-|): 마블 다이어그램을 표현한 내용이다.
// const obs$ = new Observable((observer) => {
//     observer.next(1);
//
//     setTimeout(() => {
//         observer.next(3);
//     }, 3000);
//
//     setTimeout(() => {
//         observer.next(5);
//         observer.complete();
//     }, 4500);
// });
//
// obs$.pipe(
//     mergeMap((v) =>
//         interval(1000).pipe(
//             map((time) => [time + 1, 10 * v]),
//             take(3)
//         )
//     )
// ).subscribe(
//     (res) => {
//         console.log(`${res[0]}`, '->', `${res[1]}`)
//     }
// );

// distinctUntilChanged(): 중복된 데이터가 연속적으로 들어오는걸 방지한다.
// of(1, 1, 2, 2, 3).pipe(
//     distinctUntilChanged()
// ).subscribe(
//     (v) => console.log(v)
// );
