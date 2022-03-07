/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
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
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    let removeAccBtn = this.element.querySelectorAll(`.remove-account`);
    let removeAccBtnArray = [...removeAccBtn];
    for (let i = 0; i < removeAccBtnArray.length; i++){
      removeAccBtn[i].onclick = ()=> {
        this.removeAccount();
      }
    }

    let removeTransactionBtn = this.element.querySelectorAll(`.transaction__remove`);
    let removeTransactionBtnArray = [...removeTransactionBtn];
    for (let j = 0; j < removeTransactionBtnArray.length; j++) {
      removeTransactionBtn[j].onclick = ()=> {
        let iD = removeTransactionBtn[j].getAttribute(`data-id`);
        this.removeTransaction(iD);
      }
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    let id = this.element.getAttribute('lastOptions');
    if (id){
      if(confirm(`Вы действительно хотите удалить счёт?`)){
        Account.remove(id, (err, response) => {
          if (response.success) {
            this.clear();
            App.updateWidgets();
            App.updateForms();
          }
        })
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(confirm(`Вы действительно хотите удалить эту транзакцию?`)){
      Transaction.remove(id, (err,response)=> {
        if (response.success){
          App.update();
        } else {
          console.error(err);
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.element.setAttribute('lastOptions', `${options["account_id"]}`);
      Account.get(options["account_id"], (err,response)=> {
        if (response.success) {
          this.renderTitle(response.data.name);
          Transaction.list(options["account_id"], (err,response)=> {
            if(response.success) {
              this.renderTransactions(response.data);
            } else {
              console.error(err);
            }
          })
        } else {
          console.error(err);
        }
      });
    } else if (this.element.getAttribute('lastOptions')){
      let iD = this.element.getAttribute('lastOptions');
      Account.get(iD, (err,response)=> {
        if (response.success) {
          this.renderTitle(response.data.name);
          Transaction.list(iD, (err,response)=> {
            if(response.success) {
              this.renderTransactions(response.data);
            } else {
              console.error(err);
            }
          })
        } else {
          console.error(err);
        }
      });
    } else {
      return
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    let data = [];
    this.renderTransactions(data);
    this.renderTitle(`Название счёта`);
    this.element.removeAttribute(`lastOptions`);
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    let headerLine = document.querySelector(`.content-title`);
    headerLine.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let dateArr = date.split(/:|-|T/);
    let months = [
      `января`,
      `февраля`,
      `марта`,
      `апреля`,
      `мая`,
      `июня`,
      `июля`,
      `августа`,
      `сентября`,
      `октября`,
      `ноября`,
      `декабря`
    ];
    return `${dateArr[2]} ${months[dateArr[1] - 1]} ${dateArr[0]} г. в ${dateArr[3]}:${dateArr[4]}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    let date = this.formatDate(item["created_at"]);
    return  `<div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <!-- дата -->
              <div class="transaction__date">${date}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    let content = document.querySelector(`.content`);
    let transactionsList = '';
    if (data.length > 0) {
      for (let k = 0; k < data.length; k++) {
        transactionsList += this.getTransactionHTML(data[k]);
      }
      content.innerHTML = transactionsList;
      this.registerEvents();
    } else {
      content.innerHTML = ``;
    }
  }
}
