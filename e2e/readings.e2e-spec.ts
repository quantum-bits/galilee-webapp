import { ReadingsPage } from './readings.po';
import { expectToMatch, getBody } from './utils';

describe('readings page', function() {
  let page: ReadingsPage;

  beforeEach(() => {
    page = new ReadingsPage();
    page.navigateTo();
  });

  it('should show headers for First Reading, Second Reading, etc.', () => {
    let body = getBody();
    expectToMatch(body, /First Reading/);
    expectToMatch(body, /Second Reading/);
  });

  // there will likely be several on the page; this presumably checks for the
  // existence of at least one of each...?
  it('should have practices and resources buttons', () => {
    let practicesButton = element(by.linkText('PRACTICES'));
    let resourcesButton = element(by.linkText('RESOURCES'));
    expect(practicesButton).toBeTruthy();
    expect(resourcesButton).toBeTruthy();
  });
  
});
