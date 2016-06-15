import { GalileePage } from './app.po';

describe('galilee App', function() {
  let page: GalileePage;

  beforeEach(() => {
    page = new GalileePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
