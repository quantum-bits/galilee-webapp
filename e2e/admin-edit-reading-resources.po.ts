export class AdminEditReadingResourcesPage {

  navigateTo() {
    return browser.get('/admin/edit-reading-resources');
  }

  getCollapsibleDivText() {
    return $('.collapsible-header').getText();
  }

  getCollapsibleDiv() {
    return element(by.css('.collapsible-header'));
  }

  clickAddPracticeButton(){
    element(by.id('addPractice')).click();
  }

  clickFirstAddPracticeMenuItem(){
    element.all(by.id('addPracticeDropdownLink')).first().click();
  }

  clickFirstCollapsiblePracticesDiv() {
    element(by.id('practicesCard')).all(by.css('.collapsible-header')).first().click();
  }

  clickLastCollapsiblePracticesDiv() {
    element(by.id('practicesCard')).all(by.css('.collapsible-header')).last().click();
  }

  writeTextToLastPracticesTextArea(text){
    element(by.id('practicesCard')).all(by.tagName('textarea')).last().sendKeys(text)
  }

  writeTextToFirstPracticesTextArea(text){
    element(by.id('practicesCard')).all(by.tagName('textarea')).first().sendKeys(text)
  }

  saveTextLastPractice(){
    var el = element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body')).last().element(by.tagName('button'));
    this.clickWithWait(el);
  }

  saveTextFirstPractice(){
    var el = element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body')).first().element(by.tagName('button'));
    this.clickWithWait(el);
  }

  clickCancelFirstPractice(){
    var el = element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body')).first().element(by.linkText('CANCEL'));
    this.clickWithWait(el);
  }

  countPracticesInCard(){// NOTE: returns a promise
    return element(by.id('practicesCard')).all(by.css('.collapsible')).count();
  }

  checkSavedTextLastPractice(){
    return element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body .non-edit-mode')).last().getText();
  }

  checkSavedTextFirstPractice(){
    return element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body .non-edit-mode')).first().getText();
  }

  fetchAdviceForFirstPractice(){
    return element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body .non-edit-mode')).first().getText();
  }

  attemptLastPracticeDelete(){//this should launch a modal
    element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-header')).last().element(by.tagName('a')).click();
    //element.all(by.id('deletePractice')).last().click();
  }

  getModalsOnPage() {
    return element.all(by.css('.modal'));
  }

  clickEditPracticeButton() {
    var el = element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body')).first().element(by.linkText('EDIT'));
    this.clickWithWait(el);
  }

  // see: http://stackoverflow.com/questions/30862405/element-is-not-clickable-at-point-protractor
  // apparently protractor finds the on-screen coordinates for a given button, but
  // if there is an animation or a drop-down menu obscuring the button, the given
  // coordinates might not be 'click-able'; the following makes sure that we
  // wait until the button is clickable before attempting to click it

  clickWithWait(el) {
    var EC = protractor.ExpectedConditions;
    var isClickable = EC.elementToBeClickable(el);
    browser.wait(isClickable, 5000);
    el.click();
  }


}

