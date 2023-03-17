export function getAuthForm(type) {

    const buttonName = type === 'register' ? 'Реєстрація' : 'Увійти'

    return `
    <form class="mui-form" id="auth-form">
           <p class="error" id="error"></p>
      <div class="mui-textfield mui-textfield--float-label">
        <input type="email" id="email" required>
        <label for="email">Email</label>
      </div>
      <div class="mui-textfield mui-textfield--float-label">
        <input type="password" id="password" required>
        <label for="password">Пароль</label>
      </div>
      <button type="submit"  class="mui-btn mui-btn--raised mui-btn--primary" >
        ${buttonName}
      </button>
    </form>
  `;
}

export function getFeedbackForm() {

    const buttonName = 'Надіслати';

    return `
        <form class="mui-form" id="feedBack-form"  method="post">
        
          <p class="error" id="error"></p>
          
          <div class="mui-textfield mui-textfield--float-label">
            <input type="text" id="name" required>
            <label for="name">Ім'я</label>
          </div>
        
          <div class="mui-textfield mui-textfield--float-label">
            <input type="email" id="email" required>
            <label for="email">Email</label>
          </div>
        
          <div class="mui-textfield" >
              <textarea maxlength="250" placeholder="Повідомлення" required id=""></textarea>
          </div>
        
          <button type="submit" class="mui-btn mui-btn--raised mui-btn--primary">
            ${buttonName}
          </button>      
        </form>`;
}
