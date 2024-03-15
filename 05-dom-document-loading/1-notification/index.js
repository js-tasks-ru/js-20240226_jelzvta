export default class NotificationMessage {
    element;
    timerId;

    static lastInstance;

    constructor(message = '', {duration = 0, type = ''} = {}) {
      this.message = message;
      this.duration = duration;
      this.type = type;
      this.element = this.createTemplate();
      this.show();
    }

    createTemplate() {
      let notificationWrapper = document.createElement('div');
      notificationWrapper.classList.add('notification');
      if (this.type) {
        notificationWrapper.classList.add(this.type);
      }
      notificationWrapper.style.setProperty('--value', `${this.duration}s`);
      notificationWrapper.innerHTML =
        `<div class="timer"></div>
            <div class="inner-wrapper">
            <div class="notification-header"> ${this.type}</div>
            <div class="notification-body">
                ${this.message}
            </div>
        </div>`;
      return notificationWrapper;
    }

    show(targetElement = document.body) {
      if (NotificationMessage.lastInstance instanceof NotificationMessage) {
        NotificationMessage.lastInstance.destroy();
      }

      NotificationMessage.lastInstance = this;

      this.timerId = setTimeout(() => {
        this.destroy();
      }, this.duration);

      targetElement.appendChild(this.element);
    }

    remove() {
      this.element.remove();
    }

    destroy() {
      this.remove();
      clearTimeout(this.timerId);
    }
}
