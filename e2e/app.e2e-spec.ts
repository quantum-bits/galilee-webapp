import { GalileePage } from './app.po';
import { expectToMatch } from './utils';

// to run this test directly at the command line:
// node_modules/.bin/protractor config/protractor.conf.js --specs e2e/app.e2e-spec.ts
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
