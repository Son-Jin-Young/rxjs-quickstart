
const { interval, of } = rxjs;
const { scan, map, switchMap, mergeMap } = rxjs.operators;

interval(500).pipe(
    map((v) => Math.ceil(v / 10) % 2),
    map((v) => v === 0 ? -1 : v),
    scan((acc, flag) => acc + flag, 1)
).subscribe((v) => {
    console.log(v);
});
