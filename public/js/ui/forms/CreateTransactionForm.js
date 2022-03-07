/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let accountList = this.element.querySelector(`.accounts-select`);
    let data = ''; 
    let options;
    if (User.current()) {
      Account.list(data, (err, response) => {
        if (response.success) {
            for (let j = 0; j < response.data.length; j++) {
              options += `<option value="${response.data[j].id}">${response.data[j].name}</option>`;
            }
            accountList.innerHTML = options;
        } else {
          console.error(err);
        }
        
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err,response) => {
      if(response.success) {
        this.element.reset();
        App.getModal(`newExpense`).close();
        App.getModal(`newIncome`).close();
        App.update();
        App.showPage( 'transactions', { account_id: data.account_id });
      } else {
        console.error(err);
      }
    });
  }
}
