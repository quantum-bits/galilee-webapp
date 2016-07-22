export class ReadingsPage {

  navigateTo() {
    return browser.get('/end-user/readings');
  }

  /* not working....
  navigateToReadingPractice() {
    browser.get('/end-user/readings');
    let practicesButton = element(by.linkText('PRACTICES'));
    var readingTitle = element(by.binding('reading.title'));
  }
  */

}
