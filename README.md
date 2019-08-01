# rxjs-quickstart
RxJS Quick Start 서적 예제 및 활용 소스

##### 1. 개요
- 마이크로소프트 사에서 만든 ReactiveX의 자바스크립트 라이브러리 버전이다.
- 일관된 방식으로 안전하게 데이터 흐름을 처리하도록 도와주는 라이브러리
- 동기와 비동기의 차이점을 **시간 개념**을 도입하여 해결
- Observable은 시간을 인덱스로 둔 컬렉션을 추상화한 클래스이다.

##### 2. Observer Pattern
- Subject와 Observer 간에 느슨하게 연결되어 동작하는 패턴
- Subject: 상태가 변경되는 대상
- Observer: 변경되는 상태를 관찰하는 대상

##### 3. RxJS의 패러다임
- 리액티브 프로그래밍과 함수형 프로그래밍이 복합적으로 적용되어 있다.
- Observable은 내부적으로 링크드 리스트 형식으로 이루어져 있다.


***

##### 1. RxJS 6.x 이전, 이후 버전 비교
```
RxJS 6.x이전 버전에서는 도트체이닝을 이용하여 프로그래밍을 하였는데, 이 때 사용하지 않는 모든 함수도 모두 가져오기 때문에 번들링될 때의 용량이 컸다.
RxJS 6.x부터는 함수형 프로그래밍 형태를 제공하고 번들링시에 트리셰이킹을 하여 용량을 최소화하였다.
RxJS 6.x에서 도트체이닝을 사용한다면, rxjs-compat 모듈이 필요하다.
```

##### 2. 주요개념
- Observable: 시간을 축으로 연속적인 데이터를 저장하는 컬렉션을 표현한 객체(스트림)
- Operator: Observable을 생성 및 조작하는 함수
- Observer: Observable에 의해 전달된 데이터를 소비하는 주체
- Subscription: Observable의 자원 해제를 담당, Observable의 구독을 종료하고 싶을 때 사용

##### 3. Observable
- next: 데이터 전달
- error: 에러 발생
- complete: 데이터 전달 완료
- 모든 데이터를 Observable 인스턴스로 생성할 수 있다.
- 읽기전용이고 불변객체이며 리액티브하다.

##### 4. Observable의 구독 해지
- 에러가 발생하여 observer.error를 호출하는 경우 구독을 해지한다.
- 데이터 전달이 완료된 경우 observer.complete을 호출하는 경우 구독을 자동으로 해지한다.
- 구독을 관리하는 Subscription에서 unsubscribe 메소드를 호출하면 등록된 observer들의 구독이 해지된다.

##### 5. Function, Observable, Promise
- Observable
> 데이터를 개발자에게 전달하는 형태의 Push 방식
> 구독이라는 과정을 통해 데이터를 전달받는 시점을 지연할 수 있다.
> 구독할 때마다 독립적인 데이터를 각각의 Observer에게 전달한다.

- Function
> 데이터를 요청하는 형태의 Pull 방식
> 호출 시 반환값이 한 개 뿐이다.

- Promise
> Observable과 같은 push 방식
> Promise를 then하는 과정을 통해 시점을 지연할 수 있다.
> 독립적이 아닌 결정된 상태값만을 반환한다.

##### 6. Cold Observable, Hot Observable
- 차이점: 데이터를 전달하는 주체가 다르다.
- Cold Observable
> Observable을 subscribe할 때 독립적인 스트림이 열리고, unsubscribe할 때 그 스트림을 종료한다.
> 오직 하나의 Observer에만 동일한 데이터를 전달한다.
- Hot Observable
> Observable을 subscribe와 unsubscribe에 상관없이 하나의 스트림을 공유한다.
> subscribe 시점과 상관없이 데이터를 중간부터 전달한다.

|구분|Cold Observable|Hot Observable|
|:---|:---|:---|
|데이터 주체 생성시기|Observable 내부|Observable 외부|
|Observer와의 관계|1:1|1:N|
|데이터 영역|Observer마다 독립적|N개의 Observer와 공유|
|데이터 전달 시점|구독하는 순간부터  데이터 전달 시작|구독과 상관없이 데이터를  중간부터 전달|
|RxJS 객체|Observable|fromEvent에 의해 생성된 Observable,  ConnectableObservable, Subject|

##### 7. Subject
- Observer pattern의 Subject와 기능면에선 완전히 같다.
- Observable은 읽기전용이지만, Subject는 읽기/쓰기가 가능하다.
- 동일한 subject를 subscribe하더라도 시점에 따라 데이터의 내용이 다를 수 있다.
- Observable이면서도 Observer이다.
- 권고사항
> Suject를 외부에서 단독으로 사용하지 않는다.
> 데이터 변경이 가능하므로, 내부로 감추어 사이드 이펙트를 최소화한다.
> 가급적 Observable 내부에서 사용한다.
- ConnectableObservable
> connect 함수 제공, connect가 호출되는 순간 구독된 대상으로 데이터를 전달(next)한다.


###### RxJS 생성 오퍼레이터
- of
> 인자에 있는 값을 차례로 전달하고 모두 전달되면 구독을 해지한다.
- range
> start부터 end까지 1씩 증가시킨 숫자 데이터를 전달하고 모두 전달하면 종료하고 구독을 해지한다. start와 end는 정수로 입력해야 정상동작한다. 
- fromEvent
> target의 event를 Observable로 변환하고 event 발생시 데이터를 전달한다.
- from
> 기본타입을 제외한 배열, 배열같은 객체 등 거의 모든 데이터를 Observable로 변환하고 데이터가 모두 전달되면 구독을 해지한다.
- interval
> 지정된 시간마다 0부터 1씩 증가하는 값을 반환한다.
- empty
> Observable의 상태를 변경하고자 할 때 사용자에게 완료가 되었음을 알려주기 위해 완료상태를 전달하고 구독을 해지한다.
- throwError
> Observable의 상태를 변경하고자 할 때 사용자에게 에러의 발생을 알려주기 위해 에러상태를 전달하고 구독을 해지한다.
- never
> 전달된 데이터를 전달하고 싶지 않을 때 사용한다.
- partition
> 사용방식이 조작 오퍼레이터에서 생성 오퍼레이터로 변경되었다.
> 첫번째 인자로 Observable을 받고, 두번째 인자로 조건식을 받고, 참과 거짓인 경우에 대해 두개의 크기의 배열로 반환한다.
> 반환된 배열의 첫번째는 참인 경우, 두번째는 거짓인 경우이다.

###### RxJS 조작 오퍼레이터
- pluck
> 전달되는 값에서 해당하는 키값의 데이터만 추출한다.
- filter
> 전달받는 값이 filter 조건에 충족하면 실행하고, 충족하지 않으면 정지한다.
- map
> 전달된 값으로 데이터를 변경하고 싶을 때 사용한다.
- mergeAll
> 값이 전달될 때, 다른 Observable과 합치는 기능을 한다.
- mergeMap
> map과 mergeAll을 합한 기능이다.
> 데이터를 변경하며, 다른 Observable과 병합하여 반환하고 싶을 때 사용한다.
> 중간에 데이터가 들어와도 모든 연산은 수행된다.
- debounceTime
> 정해진 시간 내에 데이터가 전달이 되지 않을 때 스트림을 이어서 흘려보낸다.
- distinctUntilChanged
> 중복된 값이 들어올 때 스트림 진행을 막는다.
- tap
> 전달된 값을 변함없이 다음으로 전달한다.
> 디버깅용으로 사용하기도한다.
- switchAll
> 선 요청이 지연되고 있는 상황에 후 요청이 발생할 때, 선 요청을 취소하고 후 요청을 유지한다.
> 즉, 선 요청에 대해선 내부의 Observable을 unsubscribe를 하고 사용중인 Observable은 구독을 유지한다.
- switchMap
> map과 switchAll을 합한 기능이다.
> mergeMap과의 차이점
>   * mergeMap은 next 시점과 상관없이 모두 합병한다.
>   * switchMap은 후 next가 발생한 시점에 전 next를 unsubscribe를 한다.
> 빈번히 발생하는 경우 적합하다.
> 내부에서 자동으로 unsubscribe를 하므로 메모리 누수 문제에 대해서도 자유롭다.
> mergeMap 보단 switchMap을 선호한다.
- catchError
> 예외처리를 위한 오퍼레이터이다.
> Observer.error의 동작을 원하지 않고 subscribe를 유지하기 위해 사용한다.
- retry(n)
> n번 에러가 발생하면 Observer.error를 호출한다.
> 연속적인 에러와 상관없이 n번 발생하면 error 처리한다.
- finalize
> error, complete이 발생할 경우 작업을 수행한다.
> unsubscribe 발생시에도 동작한다.
- multicast
> Subject를 인자로 받고 ConnectableObservable로 변환한다.
> Hot Observable이다.
- publish
> multicast(new Subject())를 수행하는 오페레이터이다.
- refCount
> ConnectableObservable을 자동으로 관리해주는 오퍼레이터다.
> 첫번째 구독에서 자동으로 connect()를 하고 마지막 구독이 해지될 때 ConnectableObservable의 데이터 전송을 중지한다.
- share
> publish와 refCount의 alias이다.
> 하나의 데이터 소스를 함께 공유한다.

<출처> [RxJS QuickStart - 저자 손찬욱](https://github.com/sculove/rxjs-book)