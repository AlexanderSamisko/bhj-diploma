/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    try {
      this.element = element;
      if (!element) {
        throw new Error("Элемент не существует!");
      }
    } catch(e) {
      console.error(e.message);
    }

    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    let incomeBtn = this.element.querySelector(`.create-income-button`);
    let expenseBtn = this.element.querySelector(`.create-expense-button`);
    incomeBtn.addEventListener(`click`, ()=>{
      App.getModal(`newIncome`).open();
    })
    expenseBtn.addEventListener(`click`, ()=> {
      App.getModal(`newExpense`).open();
    })
  }
}
