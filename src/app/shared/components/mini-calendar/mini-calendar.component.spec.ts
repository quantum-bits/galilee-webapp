/* tslint:disable:no-unused-letiable */

import { addProviders, inject } from '@angular/core/testing';
import { MiniCalendarComponent } from './mini-calendar.component';
import * as moment from 'moment';

describe('Component: MiniCalendar', () => {

	beforeEach(() => {
		addProviders([
			MiniCalendarComponent,
			moment
		]);
	});

	it('should inject the component', inject([MiniCalendarComponent],
			(component: MiniCalendarComponent) => {
		expect(component).toBeTruthy();
		component.selected = moment();
		spyOn(component,'_removeTime').and.callThrough();
		spyOn(component,'_buildMonth').and.callThrough();
		component.ngOnInit();
		expect(component._removeTime).toHaveBeenCalled();
		expect(component._buildMonth).toHaveBeenCalled();
	}));

	it('should check the next() and previous() functions',inject([MiniCalendarComponent],
			(component: MiniCalendarComponent) => {
		component.selected = moment();
		component.ngOnInit();
		expect(component.month.month()).toBe(component.selected.month());
		component.next();
		expect(component.month.month()).not.toBe(component.selected.month());
		component.previous();
		expect(component.month.month()).toBe(component.selected.month());
		component.previous();
		expect(component.month.month()).not.toBe(component.selected.month());
	}));

	it('checks the isInWeek function', inject([MiniCalendarComponent],
			(component: MiniCalendarComponent) => {
		let day;
		expect(component.isInWeek(day)).toBeFalsy();
		component.showWeek = true;
		component.selected = moment('03/24/2016', 'MM/DD/YYYY');
		day = {
			date:moment('05/17/2016', 'MM/DD/YYYY')
		};
		expect(component.isInWeek(day)).toBeFalsy();
		day = {
			date:moment('03/24/2016', 'MM/DD/YYYY')
		};
		expect(component.isInWeek(day)).toBeTruthy();
		component.showWeek = false;
		expect(component.isInWeek(day)).toBeTruthy();
	}));

	it('should call changeSelected', inject([MiniCalendarComponent],
		(component: MiniCalendarComponent) => {
		// spyOn(component,'changeSelected').and.callThrough();
		component.select(moment());
		// expect(component.changeSelected).toHaveBeenCalled();
	}));

});
