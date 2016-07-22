import { AdminEditReadingResourcesPage } from './admin-edit-reading-resources.po';
import { expectToMatch, getBody } from './utils';

describe('admin edit reading resources page', function() {
  let page: AdminEditReadingResourcesPage;

  beforeEach(() => {
    page = new AdminEditReadingResourcesPage();
    page.navigateTo();
  });

  it('should show headers for First Reading, Practices and Resources', () => {
    let body = getBody();
    expectToMatch(body, /First Reading/);
    expectToMatch(body, /Practices/);
    expectToMatch(body, /Resources/);
  });

  // this one relies on our MOCK data
  it('should have a collapsible div with Lectio Divina header', () => {
    let collapsible = page.getCollapsibleDivText();
    expectToMatch(collapsible, /Lectio Divina/);
  });

  // this one relies on our MOCK data
  it('should open collapsible div when clicking on it', () => {
    let collapsible = page.getCollapsibleDiv();
    collapsible.click();
  });


});
