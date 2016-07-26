import { AdminEditReadingResourcesPage } from './admin-edit-reading-resources.po';
import { expectToMatch, getBody } from './utils';

// to run this test directly at the command line:
// node_modules/.bin/protractor config/protractor.conf.js --specs e2e/admin-edit-reading-resources.e2e-spec.ts
describe('admin edit reading resources page', function() {
  let page: AdminEditReadingResourcesPage;
  let numberPracticesOriginal: any;
  let originalPracticeAdvice: any;

  beforeEach(() => {
    page = new AdminEditReadingResourcesPage();
    page.navigateTo();
    page.countPracticesInCard().then(
      // putting this here ensures that the promise gets resolved before continuing:
      // http://stackoverflow.com/questions/21685161/how-to-expect-dynamic-count-of-elements-in-e2e-tests-using-protractor
      number => numberPracticesOriginal = number
    );
    page.clickFirstCollapsiblePracticesDiv(); // open up the first collapsible div
    page.fetchAdviceForFirstPractice().then(
      advice => {
        originalPracticeAdvice = advice;
        page.clickFirstCollapsiblePracticesDiv(); // close the div
      }
    );
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
    //browser.pause();
  });

  it('should have an add practice button, and be able to add a practice (with text), save it and delete it', () => {

    page.clickAddPracticeButton(); // click on the Add button to add a practice
    page.clickFirstAddPracticeMenuItem(); // select the first element in the menu
    // NOTE: expect() forces the resolution of the promise....
    expect(page.countPracticesInCard()).toEqual(numberPracticesOriginal+1); // check that # of practices in card has increased by 1
    page.clickLastCollapsiblePracticesDiv(); // open up the collapsible div for the new practice
    page.writeTextToLastPracticesTextArea('here is some test advice!'); // add some text
    page.saveTextLastPractice(); //save the new text
    page.clickLastCollapsiblePracticesDiv(); // open it up again

    expect(page.checkSavedTextLastPractice()).toEqual('here is some test advice!'); // check that the saved text is the same as what was entered

    page.attemptLastPracticeDelete();//click the delete button for the new practice; should launch a modal

    // the page has several modals, but only one of them should be active at this point;
    // the active one will have text associated with it; in the following, we check...
    //  - that there is exactly one modal active
    //  - that the modal contains certain text
    // ...and then we find the delete button on this modal and click it;
    // could probably put some of the following in the page object, but it's a bit tricky
    // with the promises, etc.
    let modalArray = page.getModalsOnPage();
    var activeModalIndex: any;
    var numberModalsLaunched = 0;
    modalArray.getText().then(textArray => {
      for (var i=0; i< textArray.length; i++) {
        if (textArray[i] !=='') { // non-empty entry...this is the active modal
          activeModalIndex = i;
          numberModalsLaunched++;
          expectToMatch(textArray[i], /Deleting this practice will also delete the associated advice, if any./);
        }
      }
      expect(numberModalsLaunched).toEqual(1);

      var el = modalArray.get(activeModalIndex).element(by.linkText('DELETE'));
      page.clickWithWait(el);

      expect(page.countPracticesInCard()).toEqual(numberPracticesOriginal); // number of practices should be back to the original value now
    });

  });

  it('should be able to add text to existing advice for existing practice and save it', () => {
    page.clickFirstCollapsiblePracticesDiv(); // open up the first collapsible div
    page.clickEditPracticeButton(); // click edit
    page.writeTextToFirstPracticesTextArea('here is some additional advice!'); // add some text
    page.saveTextFirstPractice(); //save the revised text
    page.clickFirstCollapsiblePracticesDiv(); // open up the div again
    expect(page.checkSavedTextFirstPractice()).toEqual(originalPracticeAdvice+'here is some additional advice!'); // check that the saved text is the original text plus the new text
  });



});
