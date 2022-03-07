/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    try {
      this.element = element;
      if (element.innerText == ``) {
        throw new Error("Элемент пуст!");
      }
    } catch(e) {
      console.error(e.message);
    }
    
    this.registerEvents();
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    let buttons = this.element.querySelectorAll(`[data-dismiss="modal"]`);
    let buttonsArr = [...buttons];
    for ( let i = 0; i < buttonsArr.length; i++) {
    buttonsArr[i].addEventListener(`click`, this.onClose.bind(this));  
    }
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose(e) {
    this.close();
    e.preventDefault();
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style.display = "block";
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){
    this.element.style.display = "none";
  }
}
