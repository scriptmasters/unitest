import {GroupsPage} from './groups.po';
import {browser, by, element} from 'protractor';

describe('unitest App', () => {
  let page: GroupsPage;

  beforeEach(() => {
    page = new GroupsPage();
  });

  it('should login', () => {
    page.navigateTo();
    page.logOut();
    page.navigateTo();
    page.fillCredentials();
    expect(page.getPageTitleText()).toEqual('Статистика');
  });

  it(`should display 'Unitest' as a tab title`, () => {
    page.navigateTo();
    expect(page.getUnitestTitle()).toEqual('Unitest');
  });

  it(`should route to groups`, () => {
    page.navigateToGroups();
    browser.waitForAngularEnabled(false);
    browser.sleep(5000);
    expect(page.getGroupsTitle()).toEqual('Групи');
  });

  it(`should appear dialog window 'Додати групу' on click  'Додати новий параметр'`, () => {
    page.addGroup();
    browser.sleep(3000);
    expect(page.getDialogTitle()).toEqual('Додати групу');
  });

  it(`should appear dialog window 'Редагувати групу' on click 'Редагувати групу'`, () => {
    page.navigateToGroups();
    browser.sleep(3000);
    page.editGroup();
    browser.sleep(3000);
    expect(page.getDialogTitle()).toEqual('Редагувати групу');
  });

  it(`should appear confirm dialog window 'Ви справді бажаєте видалити групу?' on click 'Видалити групу'`, () => {
    const id = element(by.id('mat-dialog-1'));
    page.navigateToGroups();
    browser.sleep(3000);
    page.deleteGroup();
    browser.sleep(3000);
    expect(id).toBeTruthy();
  });

  it(`should route to timetable of group on click 'Розклад тестування групи'`, () => {
    page.navigateToGroups();
    browser.sleep(3000);
    page.goTimetable();
    browser.sleep(3000);
    expect(page.getGroupsTitle()).toEqual('Розклад');
  });

  it(`should route to students of group on click 'Переглянути студентів групи'`, () => {
    page.navigateToGroups();
    browser.sleep(3000);
    page.goStudent();
    browser.sleep(3000);
    expect(page.getGroupsTitle()).toEqual('Студенти групи');
  });

  it(`should route test's result of group on click 'Переглянути результати тестування групи'`, () => {
    page.navigateToGroups();
    browser.sleep(3000);
    page.goResults();
    browser.sleep(3000);
    expect(page.getGroupsTitle()).toEqual('Результати');
  });

});
