import {GalileeWebappPage} from './app.po';

describe('foo App', function () {
  let page: GalileeWebappPage;

  beforeEach(() => {
    page = new GalileeWebappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Scripture Engagement');
  });
});
