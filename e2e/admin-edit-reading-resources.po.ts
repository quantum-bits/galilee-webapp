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
    element.all(by.id('savePracticeButton')).last().click();
  }

  countPracticesInCard(){// NOTE: returns a promise
    return element(by.id('practicesCard')).all(by.css('.collapsible')).count();
  }

  checkSavedText(){
    return element.all(by.id('practiceAdvice')).last().getText();
  }

  attemptLastPracticeDelete(){//this should launch a modal
    element.all(by.id('deletePractice')).last().click();
  }

  getModalsOnPage() {
    return element.all(by.css('.modal'));
  }

}

