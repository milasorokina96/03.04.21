class Chat {
  constructor(btnSend, userSms, chatArea) {
    this.btnSend = btnSend,
    this.userSms = userSms,
    this.chatArea = chatArea,

    this.sendSms();
  }

  timeout(sms, time) {
    return new Promise(resolve => {
      setTimeout(() => resolve(sms), time * 1000);
    });
  
  }
  
  rand(min, max) {
    return Math.floor(Math.random() * max + min);
  
  }
  
  createBrowserSms(userSms){
    let browserSms;
    if(userSms === 'Bye' || userSms === 'bye') {
      browserSms = 'Bye';
    } else {
      browserSms = [
        'Hello! I am a unicorn',
        'Let dance',
        'I can answer random sms',
        'Okey',
        'I am fine, and you?',
      ][this.rand(0, 4)];
    }
    return this.timeout(browserSms, this.rand(1, 10));
  }
  
  async showBrowserAnswer(userSms) {
    
    let browserSms = await this.createBrowserSms(userSms); // дождаться выполнения Таймера
  
    this.createSms(browserSms, 'chat__browserSms');
  
  }

  createSms(text, classWhoseSms){
    const sms = document.createElement('div');
    sms.innerText = text;
    sms.classList.add('chat__sms', classWhoseSms);
    this.chatArea.appendChild(sms);
    document.querySelector('.chat__sms:last-child').scrollIntoView();
  
  }

  sendSms() {
  
    this.btnSend.addEventListener('click', () => {
  
      if(this.userSms.value){
        this.createSms(this.userSms.value, 'chat__userSms');
        this.showBrowserAnswer(this.userSms.value);
  
      }
      this.userSms.value = '';
  
    });
  }
}

new Chat (
  document.getElementById('btnSend'),
  document.forms.chatForm.chatSms,
  document.getElementById('chatArea'),

)