/*

Original author:

  Blaine Backman
  email: backmanb1@gmail.com
  url: http://blainebackman.com

Modified by KK

 */


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
	selector: 'app-mini-calendar',
	templateUrl: './mini-calendar.component.html',
	styleUrls: ['./mini-calendar.component.less']
})
export class MiniCalendarComponent implements OnInit {
	@Input() showWeek;
	@Input() selected;
  @Input() calendarJournalEntries;
	@Output() changeSelected = new EventEmitter();
	month;

	constructor() {}

	ngOnInit() {
	  console.log(this.selected);
    console.log(this.calendarJournalEntries);
		this.month = moment(this.selected).clone();
    console.log(this.month.format("MMM YYYY"));

		let start = moment(this.selected).clone();
		start.date(1);
		this._removeTime(start.day(0));

		this._buildMonth(this, start, this.month);
	}

	public select(day) {
		this.selected = day.date.format('YYYY-MM-DD');
		this.changeSelected.emit(this.selected);
	};

	public isInWeek(day){
		if(this.selected && this.selected.isSame) {
			if(this.showWeek){
				let tempMoment = this.selected.clone();
				tempMoment.isoWeekday(0);
				let otherTempMoment = this.selected.clone();
				otherTempMoment.isoWeekday(7);
				otherTempMoment.isAfter(day.date);
				return tempMoment.isSame(day.date) || (tempMoment.isBefore(day.date) && otherTempMoment.isAfter(day.date));
			}else{
				return this.selected.isSame(day.date);
			}
		}
		return false;
	};

	public next() {
		let next = this.month.clone();
		this._removeTime(next.month(next.month()+1).date(1));
		this.month.month(this.month.month()+1);
		this._buildMonth(this, next, this.month);
	};

	public previous() {
		let previous = this.month.clone();
		this._removeTime(previous.month(previous.month()-1).date(1));
		this.month.month(this.month.month()-1);
		this._buildMonth(this, previous, this.month);
	};

	public _removeTime(date) {
		return date.day(0).hour(0).minute(0).second(0).millisecond(0);
	}

	public _buildWeek(date, month) {
		let days = [];
		for (let i = 0; i < 7; i++) {
			days.push({
				name: date.format('dd').substring(0, 1),
				numb: date.date(),
				isCurrentMonth: date.month() === month.month(),
				isToday: date.isSame(new Date(), 'day'),
				date: date
			});
			date = date.clone();
			date.add(1, 'd');
		}
		return days;
	}

	public _buildMonth(thi, start, month) {
		thi.weeks = [];
		let done = false, date = start.clone(), monthIndex = date.month(), count = 0;
		while (!done) {
			thi.weeks.push({ days: this._buildWeek(date.clone(), month) });
			date.add(1, 'w');
			done = count++ > 2 && monthIndex !== date.month();
			monthIndex = date.month();
		}
	}

  entriesExistThisDay(day){
    if (day.date.format('YYYY-MM-DD') in this.calendarJournalEntries) {
      return true;
    } else {
      return false;
    }
  }

  numberEntriesThisDay(day){
    if (day.date.format('YYYY-MM-DD') in this.calendarJournalEntries) {
      return this.calendarJournalEntries[day.date.format('YYYY-MM-DD')];
    }
  }


}
