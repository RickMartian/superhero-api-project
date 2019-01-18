import api from "../src/api";

class App {
    constructor() {

        this.hero = [];
        this.inputText = "";

        this.liEl = document.querySelectorAll('header ul li a');
        this.inputEl = document.querySelector('header input[type=text]');
        this.buttonEl = document.querySelector('header button');
        this.heroBoxEl = document.querySelector('.heroes');

        this.activeMenu();
        this.activeButton();
        this.addEvent();
    }

    verifyLetters(letter) {
        let letters = /^[a-zA-Z]+$/;

        if(letter.match(letters) && letter.length === 1) {
            return true;
        }

        else {
            return false;
        }

    }

    doneTyping () {
        this.getInput();
    }

    addEvent() {
        let typingTimer;
        let doneTypingInterval = 500;

        this.inputEl.addEventListener('keyup', (e) => {
            let key = e.which || e.keyCode;

            clearTimeout(typingTimer);

            if(this.verifyLetters(e.key)) {

                 this.inputText = this.inputEl.value;

            }

            if(e.key === "Backspace") {
                this.inputText = this.inputEl.value;
            }

            if(this.inputText === '')
                this.heroBoxEl.innerHTML = '';

            console.log('InputText', this.inputText);

            if(this.inputText) {

                console.log('Entrou');
                typingTimer = setTimeout(() => {
                    this.doneTyping();
                }, doneTypingInterval);
            }
                
            if(key === 13) {
                this.inputText = '';
                this.inputEl.value = '';
            }

        });
    }

    activeMenu() {

        this.liEl.forEach((element, index) => {

            element.onclick = () => {

                if(index === 0) {
                    this.heroBoxEl.innerHTML = '';
                }

                for(let i = 0; i < this.liEl.length; i++) {
                    this.liEl[i].removeAttribute('class', 'active');
                }

                element.setAttribute('class', 'active');
            }
        });
    }

    getInput() {

        this.hero = [];

        if(this.inputText !== '' && this.inputText !== undefined) {

            this.searchHero(this.inputText);
        }
        
    }

    activeButton() {

        this.buttonEl.onclick = () => {
            this.getInput();
        }
    }

    verifyResponse(response) {

        if(response == '') {
            return false;
        }
            

        if(response.response === "success") {
             return true;
        }

        else {
            alert(response.error);
            return false;
        }

    }

    setLoading(value = true) {

        if(value === true) {
        const loadingEl = document.createElement('h3');
        loadingEl.appendChild(document.createTextNode('Loading....'));
        loadingEl.setAttribute('id', 'loading');

        this.heroBoxEl.appendChild(loadingEl);

        }

        else {
            document.querySelector('#loading').remove();
            return;
        }

    }

    async searchHero(hero) {

        this.heroBoxEl.innerHTML = '';

        this.setLoading();

        try {
            const response = await api.get(`search/${hero}`);

            if(this.verifyResponse(response.data)) {

                this.getHero(response.data.results);

                this.render();

            }
                

        } catch(err) {
            alert('An error has occured!');
        }

        this.setLoading(false);
    }

    getHero(heroes) {

        this.hero = [];

        heroes.forEach((hero, index) => {

            const { id, name } = hero;
            const img_url = hero.image.url;
            let full_name = hero.biography["full-name"];

            if(full_name === '')
                full_name = 'Undefined';

            this.hero.push({
                id,
                name,
                img_url,
                full_name
            });

        });

    }

    render() {

        console.log(this.hero);

        this.hero.forEach(hero => {
            const boxEl = document.createElement('div');
            boxEl.setAttribute('class', 'polaroid');

            const imgEl = document.createElement('img');
            imgEl.setAttribute('src', hero.img_url);
            imgEl.setAttribute('style', 'width: 100%; height: 220px;');

            const textBoxEl = document.createElement('div');
            textBoxEl.setAttribute('class', 'container');

            const textEl = document.createElement('p');
            textEl.appendChild(document.createTextNode(`Name: ${hero.name}, Full-name: ${hero.full_name}, Id: ${hero.id}`));
            textBoxEl.appendChild(textEl);

            boxEl.appendChild(imgEl);
            boxEl.appendChild(textBoxEl);

            this.heroBoxEl.appendChild(boxEl);

        });

    }

}

new App();