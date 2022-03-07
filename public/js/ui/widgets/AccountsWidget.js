/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */


class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
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
    this.update();

  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    let createAccBtn = this.element.querySelector(`.create-account`);
    createAccBtn.addEventListener(`click`, ()=> {
      App.getModal( 'createAccount' ).open();
    });

    let accounts = [...this.element.querySelectorAll(`.account`)];
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].addEventListener(`click`, ()=> {
        this.onSelectAccount(accounts[i]);
      });
    };
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if(User.current()){
      let user = User.current();
      Account.list(user.data, (err, response) => {
        if (response.success) {
          this.clear();
          this.renderItem(response.data);
          this.registerEvents();
        } else {
          console.error(err);
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let toRemove = [...this.element.querySelectorAll(`.account`)];
    for ( let j = 0; j < toRemove.length; j++) {
      toRemove[j].remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    if(this.element.querySelector(`.active`)) {
      let previous = this.element.querySelector(`.active`);
      previous.classList.remove("active");
    }
    element.classList.add("active");
    let id = element.getAttribute(`data-id`);
    App.showPage( 'transactions', { account_id: id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `<li class="account" data-id="${item.id}">
    <a href="#">
        <span>${item.name}</span> /
        <span>${item.sum} ₽</span>
    </a>
    </li>`
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for (let k = 0; k < data.length; k++) {
      this.element.innerHTML += this.getAccountHTML(data[k]);
    };
  }
}
