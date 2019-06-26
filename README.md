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

###### RxJS 함수
- fromEvent(dom, event): dom의 event를 Observable로 변환한다.
- pluck(key): Observable이 반환해주는 값에서 key에 해당하는 속성을 추출한다. key에 해당하는 속성이 없는 경우 undefined를 반환한다.
- filter((data) => condition): 전달받는 Observable 값이 condition이 true인 경우 계속 진행하고, false인 경우 진행을 중단한다. 


<출처> [RxJS QuickStart - 저자 손찬욱](https://github.com/sculove/rxjs-book)