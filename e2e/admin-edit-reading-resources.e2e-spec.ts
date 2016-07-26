import { AdminEditReadingResourcesPage } from './admin-edit-reading-resources.po';
import { expectToMatch, getBody } from './utils';

// to run this test directly at the command line:
// node_modules/.bin/protractor config/protractor.conf.js --specs e2e/admin-edit-reading-resources.e2e-spec.ts
describe('admin edit reading resources page', function() {
  let page: AdminEditReadingResourcesPage;
  let numberPracticesOriginal: any;

  beforeEach(() => {
    page = new AdminEditReadingResourcesPage();
    page.navigateTo();
    page.countPracticesInCard().then(
      // putting this here ensures that the promise gets resolved before continuing:
      // http://stackoverflow.com/questions/21685161/how-to-expect-dynamic-count-of-elements-in-e2e-tests-using-protractor
      number => numberPracticesOriginal = number
    )
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
    page.writeTextToPracticesTextArea('here is some test advice!'); // add some text
    page.saveText(); //save the new text
    page.clickLastCollapsiblePracticesDiv(); // open it up again

    expect(page.checkSavedText()).toEqual('here is some test advice!'); // check that the saved text is the same as what was entered

    page.attemptLastPracticeDelete();//click the delete button for the new practice; should launch a modal

    // the page has several modals, but only one of them should be active;
    // the active one will have text associated with it; we check...
    //  - that there is exactly one modal active
    //  - that the modal contains certain text
    // ...and then we find the delete button on this modal and click it
    let modalArray = page.getModalsOnPage();
    var activeModalIndex: any;
    var numberModalsLaunched = 0;
    modalArray.getText().then(textArray => {
      console.log('got here');
      console.log(textArray);
      console.log (textArray.length);
      for (var i=0; i< textArray.length; i++) {
        if (textArray[i] !=='') {
          console.log('we have a non-zero entry');
          console.log(i);
          activeModalIndex = i;
          numberModalsLaunched++;
          expectToMatch(textArray[i], /Deleting this practice will also delete the associated advice, if any./);
        }
      }
      console.log('number modals launched: ');
      console.log(numberModalsLaunched);
      expect(numberModalsLaunched).toEqual(1);

      //browser.pause();
      modalArray.get(activeModalIndex).element(by.linkText('DELETE')).click(); // delete the practice


    });

    expect(page.countPracticesInCard()).toEqual(numberPracticesOriginal); // number of practices should be back to the original value now



  });



});
