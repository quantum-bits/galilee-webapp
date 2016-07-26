import { ReadingsPage } from './readings.po';
import { expectToMatch, getBody } from './utils';

// to run this test directly at the command line:
// node_modules/.bin/protractor config/protractor.conf.js --specs e2e/readings.e2e-spec.ts
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

  // there are several PRACTICES links on the page; this selects the
  // first, clicks it, then selects the LECTIO DIVINA menu item and clicks
  // it; this should bring it to a page that contains the specified text
  it('should have practice button, with menu item containing lectio divina', () => {

    //element(by.linkText('PRACTICES')).click();
    //element(by.linkText('LECTIO DIVINA')).click();
    page.clickPracticesButton();
    page.clickLectioDivinaMenuItem();

    let body = getBody();

    expectToMatch(body, /Here is some advice for how to do Lectio Divina for this passage./);

    //browser.pause(); // useful for debugging, etc.
    //expect(page.getPracticesButton()).toBeTruthy();
    //expect(page.getResourcesButton()).toBeTruthy();
  });

  // there are several RESOURCES links on the page; this selects the
  // first, clicks it, then selects the NOAH'S ARK (IMAGE) menu item and clicks
  // it; this should bring it to a page that contains the specified text
  it('should have resources button, with menu item for a particular image', () => {

    //element(by.linkText('PRACTICES')).click();
    //element(by.linkText('LECTIO DIVINA')).click();
    page.clickResourcesButton();
    page.clickNoahsArkMenuItem();

    let body = getBody();

    expectToMatch(body, /The animals came in two by two/);
  });


});
