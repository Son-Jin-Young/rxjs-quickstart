const {of} = rxjs;
const {filter, map, reduce, switchMap} = rxjs.operators;

fetch('https://swapi.co/api/people/?format=json').then(res => {
    if (res.status === 200) {
        return res.json();
    } else {
        throw new Error('Fetch Error!!');
    }
}).then(json => {
    process(json);
}).catch(err => {
    console.error(err);
});

function process(people) {
    of(people).pipe(
        switchMap(data => of(...data.results)),
        filter(user => /male|female/.test(user.gender)),
        map(user => Object.assign(user, logic(user.height, user.mass, user.gender))),
        reduce((html, user) => {
            html.push(makeHTML(user));
            return html;
        }, []),
        map(html => html.join(''))
    ).subscribe(html => {
        document.querySelector('#users').innerHTML = html;
    });
}

function logic(height, mass, gender) {
    let broca = ((height - (gender === 'male' ? 100 : 105)) * 0.9).toFixed(2);
    let bmi = ((height / 100 * height / 100) * (gender === 'male' ? 22 : 21)).toFixed(2);

    const obesityUsingBroca = ((mass - broca) / broca * 100).toFixed(2);
    const obesityUsingBmi = ((mass - bmi) / bmi * 100).toFixed(2);

    return {
        broca, bmi, obesityUsingBroca, obesityUsingBmi
    };
}

function makeHTML(user) {
    return `<li class="card">
    <dl>
        <dt>${user.name} <i class="fa fa-${user.gender}"></i></dt>
        <dd><span>키 : </span><span>${user.height}</span></dd>
        <dd><span>몸무게 : </span><span>${user.mass}</span></dd>
        <dd><span>BROCA 표준체중 : </span><span>${user.broca}</span></dd>
        <dd><span>BROCA 비만도: </span><span>${user.obesityUsingBroca}</span></dd>
        <dd><span>BMI 표준체중 : </span><span>${user.bmi}</span></dd>
        <dd><span>BMI 비만도 : </span><span>${user.obesityUsingBmi}</span></dd>
    </dl>
</li>`;
}