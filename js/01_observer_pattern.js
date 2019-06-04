/***
 * Observer Pattern 기본 동작 예제
 * 신문(Subject)
 * 신문스크랩퍼, 신문구독자(Observer)
 */

/**
 * 신문(Subject)
 */
class NewsPaper {
    constructor() {
        this._observers = [];
    }

    setNews(news) {
        this.notify(news);
    }

    add(observer) {
        this._observers.push(observer);
    }

    remove(observer) {
        const idx = this._observers.indexOf(observer);

        if (idx !== -1) {
            this._observers.splice(idx, 1);
        }
    }

    notify(news) {
        this._observers.forEach((v) => {
            v.update(news);
        });
    }
}

/**
 * 스크랩퍼(Observer)
 */
class NewsScrapper {
    update(news) {
        console.log(`뉴스 스크랩 - ${news}`);
    }
}

/**
 * 구독자(Observer)
 */
class NewsReader {
    update(news) {
        console.log(`뉴스 읽기 - ${news}`);
    }
}

const newsPaper = new NewsPaper();
const newsScrapper = new NewsScrapper();
const newsReader = new NewsReader();

newsPaper.add(newsScrapper);
newsPaper.add(newsReader);

newsPaper.notify('피곤한 날, 치맥은 힐링~!');
newsPaper.notify('월요일은 월래 술 마시는 날.');
newsPaper.notify('화요일은 화나서 술 마시는 날');
newsPaper.notify('수요일은 술요일이니까 술 마시는 날');
newsPaper.notify('목요일은 목 마르니 술 마시는 날');
newsPaper.notify('금요일은 금 같은 날이니까 술 마시는 날');
newsPaper.notify('토요일은 토 할 때까지 술 마시는 날');
newsPaper.notify('일요일은 일찍 술 마시는 날');
