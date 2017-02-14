import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';
import {AuthHttp} from 'angular2-jwt';

import {ReadingDay, DailyQuestion} from '../interfaces/reading.interface';

@Injectable()
export class QuestionService {

  constructor(private authHttp: AuthHttp) {
  }

  // Create a question. Must be associated with a reading day.
  createQuestion(question: DailyQuestion, readingDay: ReadingDay): Observable<DailyQuestion> {
    return this.authHttp.post('/api/questions', {
      text: question.text,
      seq: question.seq,
      readingDayId: readingDay.id
    }).map(resp => resp.json());
  }

  readQuestion(questionId: number): Observable<DailyQuestion> {
    return this.authHttp
      .get(`/api/questions/${questionId}`)
      .map(resp => resp.json());
  }

  updateQuestion(questionId: number, question: DailyQuestion, readingDay: ReadingDay): Observable<DailyQuestion> {
    return this.authHttp
      .patch(`/api/questions/${questionId}`, {
        text: question.text,
        seq: question.seq,
        readingDayId: readingDay.id
      })
      .map(resp => resp.json());
  }

  deleteQuestion(questionId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/questions/${questionId}`)
      .map(resp => resp.json());
  }

}
