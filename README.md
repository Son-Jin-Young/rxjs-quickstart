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

###### RxJS 함수
- of(...values): 인자에 있는 값을 차례로 전달하고 모두 전달되면 구독을 해지한다.
- range(start, end, scheduler): start부터 end까지 1씩 증가시킨 숫자 데이터를 전달하고 모두 전달하면 종료하고 구독을 해지한다. start와 end는 정수로 입력해야 정상동작한다. 
- fromEvent(target, event): target의 event를 Observable로 변환하고 event 발생시 데이터를 전달한다.
- from(values): 기본타입을 제외한 배열, 배열같은 객체 등 거의 모든 데이터를 Observable로 변환하고 데이터가 모두 전달되면 구독을 해지한다.
- interval(time): 지정된 time마다 0부터 1씩 증가하는 값을 만드는 Observable이다.
- empty(): Observable의 상태를 변경하고자 할 때 사용자에게 완료가 되었음을 알려주기 위해 완료상태를 전달하고 구독을 해지한다.
- throwError(): Observable의 상태를 변경하고자 할 때 사용자에게 에러의 발생을 알려주기 위해 에러상태를 전달하고 구독을 해지한다.
- never(): 전달된 데이터를 전달하고 싶지 않을 때 사용한다.
- pluck(key): Observable이 반환해주는 값에서 key에 해당하는 속성을 추출한다. key에 해당하는 속성이 없는 경우 undefined를 반환한다.
- filter((data) => condition): 전달받는 Observable 값이 condition이 true인 경우 계속 진행하고, false인 경우 진행을 중단한다. 


<출처> [RxJS QuickStart - 저자 손찬욱](https://github.com/sculove/rxjs-book)