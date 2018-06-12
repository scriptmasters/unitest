import {browser, by, element} from 'protractor';

export class GroupsPage {

  private credentias = {
    username: 'admin',
    password: '1qaz2wsx'
  };

  navigateTo() {
    return browser.get('/');
  }

  navigateToGroups() {
    return browser.get('/admin/groups');
  }

  getUnitestTitle() {
    return browser.getTitle();
  }

  fillCredentials(credentias: any = this.credentias) {
    element(by.css(`#login`)).sendKeys(credentias.username);
    element(by.css(`#password`)).sendKeys(credentias.password);
    element(by.css(`#submit`)).click();
  }

  getPageTitleText() {
    return element(by.css(`.breadcrumb li:last-child span`)).getText();
  }

  logOut() {
    element(by.css(`.log-out`)).click();
  }

  getGroupsTitle() {
    return element(by.css(`.breadcrumb li:last-child span`)).getText();
  }

  addGroup() {
    element(by.id(`addGroup`)).click();
  }

  getDialogTitle() {
    return element(by.css(`h2.pl-1`)).getText();
  }

  editGroup() {
    element(by.css(`table tbody tr:first-child td i.fa.fa-cog`)).click();
  }

  deleteGroup() {
    element(by.css(`table tbody tr:first-child td i.fa.fa-close`)).click();
  }

  goTimetable() {
    element(by.css(`table tbody tr:first-child td i.fa.fa-calendar`)).click();
  }

  goStudent() {
    element(by.css(`table tbody tr:first-child td i.fa.fa-user`)).click();
  }

  goResults() {
    element(by.css(`table tbody tr:first-child td i.fa.fa-list`)).click();
  }
}
