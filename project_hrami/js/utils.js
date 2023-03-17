export function isValid(value) {
    return value.length >= 10;
}

const options = {
    'keyboard': true, // teardown when <esc> key is pressed (default: true)
    'static': true, // maintain overlay when clicked (default: false)
};

export function createModal(type, content) {
    const modal = document.createElement('div')
    modal.classList.add('modal');


    let name = '';
    let linkName = '';

    switch (type) {
        case   'register':
            name = 'Реєстрація';
            linkName = 'Увійти';
            break;
        case   'login':
            name = 'Увійти';
            linkName = 'Реєстрація';
            break;
        default:
        case   'feedBack':
            name = 'Зворотній зв\'язок';
            modal.classList.add('modal-fb');
            break;
    }

    modal.innerHTML = `
        <a class="close-modal"><button></button></a>
        <h1>${name}</h1> 
        <div class="modal-content">${content}</div>`;

    if (type === 'register' || type === 'login') {
        modal.innerHTML = `${modal.innerHTML}
        <a id="register">${linkName}</a>`;
    }


    mui.overlay('on', options, modal);
}

export function activateModal(content) {

    const modalEl = document.createElement('div');
    modalEl.classList.add('modal-info');
    modalEl.innerHTML = `<div class="info" >${content}</div>`;

    mui.overlay('on', modalEl);
}

export function closeModal() {
    mui.overlay('off');

}
