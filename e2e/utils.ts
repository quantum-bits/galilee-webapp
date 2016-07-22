// originally written by Keith Bauson for the faraday project
export function expectToMatch(str, regex) {
  expect(str).toEqual(jasmine.stringMatching(regex));
}

export function getBody() {
  return $('body').getText();
}

export function login() {
  browser.get('/login');
  let email = $('#email');
  let password = $('#password');
  let loginButton = element(by.linkText('LOGIN'));
  email.clear();
  password.clear();
  email.sendKeys('test@example.com');
  password.sendKeys('pass');
  loginButton.click();
}

export function logout() {
  let logoutButton = element(by.linkText('Log Out'));
  logoutButton.click();
}

