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

  clickLastCollapsiblePracticesDiv() {
    element(by.id('practicesCard')).all(by.css('.collapsible-header')).last().click();
  }

  writeTextToPracticesTextArea(text){
    element(by.id('practicesCard')).all(by.tagName('textarea')).last().sendKeys(text)
  }

  saveText(){
    // see: http://stackoverflow.com/questions/30862405/element-is-not-clickable-at-point-protractor
    var EC = protractor.ExpectedConditions;
    var el = element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body')).last().element(by.tagName('button'));
    var isClickable = EC.elementToBeClickable(el);
    console.log('waiting for save button to be clickable');
    browser.wait(isClickable, 5000);
    console.log('done waiting');
    el.click();
    }

  countPracticesInCard(){// NOTE: returns a promise
    return element(by.id('practicesCard')).all(by.css('.collapsible')).count();
  }

  checkSavedText(){
    //return element.all(by.id('practiceAdvice')).last().getText();
    return element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-body .non-edit-mode')).last().getText();
  }

  attemptLastPracticeDelete(){//this should launch a modal
    element(by.id('practicesCard')).all(by.css('.collapsible .collapsible-header')).last().element(by.tagName('a')).click();
    //element.all(by.id('deletePractice')).last().click();
  }

  getModalsOnPage() {
    return element.all(by.css('.modal'));
  }

}

