import { GalileePage } from './app.po';
import { expectToMatch } from './utils';

describe('galilee App', function() {
  let page: GalileePage;

  beforeEach(() => {
    page = new GalileePage();
    page.navigateTo();
  });

  it('should have toolbar with welcome', () => {
    let bar = page.getToolbar();
    expectToMatch(bar, /Scripture Engagement/);
  });

  it('should redirect to end-user/readings', () => {
    expectToMatch(browser.getCurrentUrl(), /\/end-user\/readings$/);
  });

});
