import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import {closeModal, createModal, activateModal} from "./utils";
import {getAuthForm, getFeedbackForm} from "./form";

import mediumZoom from 'medium-zoom';


const firebaseConfig = {  //paste firebase config here
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};

firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();
const commentsRef = dbRef.child('comments');
const admins = [   // paste admins here
    '',
    ''
];

function isAdmin(email) {
    if (!email) return false;
    return admins.includes(email);
}

const pages = [
    'asakusa',
    'dzodzyodzi',
    'fusimiinari',
    'futara',
    'kasugataicya',
    'kinkakudzi',
    'kofukudzi',
    'rinnodzi',
    'sandzusangendo',
    'sensodzi',
    'taiyunbe',
    'todaidzi',
    'tosegu',
    'yakuoin',
    'yakusidzi',
    'yasakadzindza',
];

function scrollFunction() {
    const btnTop = document.getElementById("top");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
}


window.addEventListener("load", function () {
    const images = [
        ...document.querySelectorAll('.zooming'),
    ]
    if (images.length) {
        const zoom = mediumZoom(document.querySelectorAll('.zooming'), {
            margin: 24,
            background: 'rgba(0, 0, 0, 0.8)',
            scrollOffset: 0,
            // container: document.querySelector('#zoom-container')
        });
        zoom.close();
    }

    document.querySelectorAll('.random').forEach(el => {
        el.addEventListener('click', () => {
            const randomElement = pages[Math.floor(Math.random() * pages.length)];
            window.location.href = `/pages/${randomElement}.html`;
        })
    })

    window.onscroll = function () {
        scrollFunction();
    };

    // menu
    const buttonMenu1 = document.querySelector('[data-target="#ResponsiveNav"]');
    const menu1 = document.getElementById('ResponsiveNav');
    const menu2 = document.getElementById('ResponsiveNav1');

    buttonMenu1.addEventListener('click', () => {
        if (menu2.classList.contains('show')) {
            menu2.classList.remove('show');
        }
    })

    const responsiveNav = document.querySelectorAll('#ResponsiveNav .navbar-nav .nav-item a');
    responsiveNav.forEach(elem => {
        elem.addEventListener('click', function (event) {
            if (menu1.classList.contains('show')) {
                menu1.classList.remove('show');
            }
        });
    })

    const responsiveNavs1 = document.querySelectorAll('#ResponsiveNav1 .navbar-nav .dropdown a');
    responsiveNavs1.forEach(elem => {
        elem.addEventListener('click', function (event) {
            if (elem.classList.contains('nav-link')) {
                event.preventDefault();
            }
            displayMenu(elem);
            if (event.target.nodeName === 'A') {
                if (menu2.classList.contains('show')) {
                    menu2.classList.remove('show');
                }
            }
        });
    })

    const responsiveNavs2 = document.querySelectorAll('#ResponsiveNav2 a');
    responsiveNavs2.forEach(elem => {

        elem.addEventListener("click", function (event) {

            if (elem.classList.contains('nav-link')) {
                event.preventDefault();
            }
            displayMenu(elem);
        });
    })

    function displayMenu(elem) {
        const nextElem = elem.nextElementSibling;
        nextElem.classList.toggle("show111");
        const els = document.getElementsByClassName("show111");
        for (let item of els) {
            if (nextElem !== item) {
                item.classList.remove("show111");
            }
        }


    }

    const logOut = document.getElementById('log-out');
    const modalBtn = document.getElementById('modal-btn');
    const muiOverlay = document.getElementById('mui-overlay');
    const comment = document.getElementById('comment');
    const commentTextarea = document.querySelector('#comment textarea');

    modalBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal('login');
    });

    if (commentTextarea) {
        commentTextarea.addEventListener("input", () => {
            document.getElementById("counter").innerText = `${150 - commentTextarea.value.length}`;
        });

        commentTextarea.addEventListener('keyup', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                if (commentTextarea.value.trim().length) {
                    addComment(commentTextarea.value);
                    commentTextarea.value = '';
                }
            }
        })
    }

    firebase.auth().onAuthStateChanged(function (user) {
        commentsRef.once('value').then(snap => {
            if (snap.val()) {
                shoWComments(snap.val());
            }
        })

        if (user) {
            displayUser(user.email);
            logOut.style.display = 'block';
            modalBtn.style.display = 'none';
            if (comment) {
                comment.classList.remove("hide_comment");
                comment.classList.add("show_comment");
            }
            closeModal();
        } else {
            logOut.style.display = 'none';
            modalBtn.style.display = 'block';
            if (comment) {
                comment.classList.remove("show_comment");
                comment.classList.add("hide_comment");
            }
        }
    });

    logOut.addEventListener('click', (event) => {
        firebase.auth().signOut();
        displayUser('');
    })

    function openModal(type) {
        closeModal();

        switch (type) {
            case 'login':
                createModal(type, getAuthForm(type));
                login();
                break;
            case 'register' :
                createModal(type, getAuthForm(type));
                register();
                break;
            case 'feedBack':
                createModal(type, getFeedbackForm());
                feedBack();
                break;
        }
    }

    function formatDate(date) {
        const dt = new Date(date);
        return `${dt.getDate().toString().padStart(2, '0')}/${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')}
        ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`;
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    function removeComment(id) {
        commentsRef.child(id).remove();
    }

    function changeCommentPublish(id, publish) {
        publish = publish === 'false';
        commentsRef.child(id).update({publish: Boolean(publish)});
    }

    function shoWComments(fullComments) {
        const listContainer = document.getElementById('comment_list');
        let comments = Object.values(fullComments);
        const page = (window.location.pathname).split('/')[2];
        const email = (firebase.auth().currentUser) ? firebase.auth().currentUser.email : '';
        const admin = isAdmin(email);

        if (comments.length) {
            if (listContainer) {
                listContainer.innerHTML = "";
                comments = comments
                    .filter((comment) => admin ? comment : comment.publish)
                    .filter((comment) => comment.page === page)
                    .sort((x, y) => y.date - x.date);

                comments.splice(0, 10)
                    .forEach((comment) => {
                        const id = getKeyByValue(fullComments, comment);
                        const userName = comment.user.split('@')[0];
                        const listItem = document.createElement('div');

                        listItem.innerHTML = `
                                    <h4 class="user_mess"> 
                                        ${userName.charAt(0).toUpperCase()}${userName.slice(1)} 
                                        <em><small>дата: ${formatDate(comment.date)}</small></em>
                                    </h4>
                                    <h5 class="text_mess">${comment.text}
                                        ${admin ? `<button  data-id=${id} class="delete" title="Видалити"></button><button data-id=${id} data-publish="${comment.publish}" class="pub_but ${comment.publish ? 'un-publish' : 'publish'}" title="${comment.publish ? 'Скасувати публікацію' : 'Опублікувати'}"></button>` : ``}  
                                     </h5>`;
                        listContainer.appendChild(listItem);
                    })

                document.querySelectorAll('button.delete').forEach(el => {
                    el.addEventListener('click', (event) => {
                        const id = el.getAttribute('data-id')
                        removeComment(id);
                    })
                })

                document.querySelectorAll('button.pub_but').forEach(el => {
                    el.addEventListener('click', (event) => {
                        const id = el.getAttribute('data-id');
                        const publish = el.getAttribute('data-publish');
                        changeCommentPublish(id, publish);
                    })
                })
            }
        }
    }

    commentsRef.on("value", (snap) => {
        if (snap.val()) {
            shoWComments(snap.val());
        }
    });

    const commentButton = document.querySelector('#comment button');
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            if (commentTextarea && commentTextarea.value.trim().length) {
                addComment(commentTextarea.value);
                commentTextarea.value = '';
            }
        })
    }

    // login
    function login() {
        document.getElementById('register').addEventListener('click', () => {
            openModal('register')
        });

        document.getElementById('auth-form')
            .addEventListener('submit', (event) => {
                event.preventDefault();
                const btn = event.target.querySelector('button');
                const email = event.target.querySelector('#email').value;
                const password = event.target.querySelector('#password').value;
                btn.disabled = true;

                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((result) => {
                            muiOverlay.style.display = 'none';
                            displayUser(email);
                            return result.user;
                        }
                    ).catch(err => {
                        let message = '';
                        switch (err.code) {
                            case 'auth/user-not-found':
                                message = 'Такого користувача не існує! Зареєструйтесь будь ласка.';
                                break;
                            case 'auth/wrong-password':
                                message = 'Невірний пароль!';
                                break;
                            default:
                                message = 'Ви десь помилилися!';
                                break;
                        }
                        console.log(document.querySelector('.modal'));
                        document.querySelector('.modal').style.maxHeight = '381px';
                        event.target.querySelector('#error').innerHTML = errHandler(err.code);
                        btn.disabled = false;
                    }
                );
            })

        const closeModalButton = document.querySelector('.close-modal');
        closeModalFn(closeModalButton);
    }

    // register
    function register() {
        document.getElementById('register').addEventListener('click', () => {
            openModal('login');
        });
        document.getElementById('auth-form')
            .addEventListener('submit', (event) => {
                event.preventDefault();
                const btn = event.target.querySelector('button');
                const email = event.target.querySelector('#email').value;
                const password = event.target.querySelector('#password').value;
                btn.disabled = true;

                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function (result) {
                        muiOverlay.style.display = 'none';
                        displayUser(email);
                        return result.user;
                    }).catch(err => {
                    document.querySelector('.modal').style.maxHeight = '381px';
                    event.target.querySelector('#error').innerHTML = errHandler(err.code);
                    btn.disabled = false;
                });
            })

        const closeModalButton = document.querySelector('.close-modal');
        closeModalFn(closeModalButton);
    }

    function errHandler(code) {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Такий користувач вже існує!';
            case 'auth/user-not-found':
                return 'Такого користувача не існує! Зареєструйтесь будь ласка.';
            case 'auth/wrong-password':
                return 'Невірний пароль!';
            default:
                return 'Ви десь помилилися!';
        }

    }

    function closeModalFn(closeModalButton) {
        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => {
                closeModal();
            })
        }
    }

    // feedBack
    function feedBack() {
        const feedBackForm = document.getElementById('feedBack-form');
        if (!feedBackForm) return;
        feedBackForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const btn = event.target.querySelector('button');
            const email = event.target.querySelector('#email').value;
            const name = event.target.querySelector('#name').value;
            const body = event.target.querySelector('textarea').value;
            const yourEmail = "denys.chakhalian@nure.ua";                // paste your email for feedback here
            btn.disabled = true;
            feedBackForm.action = `mailto:${yourEmail}?subject=Храми Японії&body=${body}.%0A%0AІм'я: ${name}%0AEmail: ${email}`;
            setTimeout(() => {
                feedBackForm.submit();
                closeModal();
            }, 60)

        })

        const closeModalButton = document.querySelector('.close-modal');
        closeModalFn(closeModalButton);
    }

    const feedBackBtns = document.querySelectorAll('.feedBack');
    if (feedBackBtns && feedBackBtns.length) {
        feedBackBtns.forEach((feedBackBtn) => {
            feedBackBtn.addEventListener('click', (event) => {
                event.preventDefault();
                openModal('feedBack');
            })
        })
    }

    function addComment(text) {
        const user = firebase.auth().currentUser;
        const page = (window.location.pathname).split('/')[2];
        if (user) {
            const newPostRef = commentsRef.push();
            const post = {
                text,
                user: user.email,
                page: page || '',
                date: new Date().getTime(),
                publish: false
            }
            newPostRef.set(post);
            document.getElementById("counter").innerText = `${150}`;
        }

        activateModal('Ваш коментарій надіслано на модерацію!');
        setTimeout(() => {
            closeModal();
        }, 3000)
    }
})

function displayUser(user) {
    user = user.split('@')[0];
    document.getElementById('log-out').textContent = user ? `${user}` : '';
}


window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show111')) {
                openDropdown.classList.remove('show111');
            }
        }
    }
}
