import api from "../src/api";

class App {
    constructor() {

        this.hero = [];
        this.inputText = "";
        this.cont = 0;
        this.boxEll;
        this.pag;
        this.beforePage;

        this.liEl = document.querySelectorAll('header ul li a');
        this.inputEl = document.querySelector('header input[type=text]');
        this.buttonEl = document.querySelector('header button');
        this.containerHeroBoxEl = document.querySelector('#heroes-container');
        this.paginationEl = document.querySelector('#pagination');

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

            if(this.inputText === '') {

                this.containerHeroBoxEl.innerHTML = '';
                this.paginationEl.innerHTML = '';
            }


            if(this.inputText) {

                typingTimer = setTimeout(() => {
                    this.doneTyping();
                }, doneTypingInterval);
            }
                
            if(key === 13) {
                this.getInput();
                this.inputText = '';
                this.inputEl.value = '';
            }

        });
    }

    activeMenu() {

        this.liEl.forEach((element, index) => {

            element.onclick = () => {

                if(index === 0) {
                    this.containerHeroBoxEl.innerHTML = '';
                    this.paginationEl.innerHTML = '';
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

        this.containerHeroBoxEl.appendChild(loadingEl);

        }

        else {
            document.querySelector('#loading').remove();
            return;
        }

    }

    async searchHero(hero) {

        this.containerHeroBoxEl.innerHTML = '';
        this.paginationEl.innerHTML = '';

        this.setLoading();

        try {
            const response = await api.get(`search/${hero}`);

            if(this.verifyResponse(response.data)) {

                this.getHero(response.data.results);

                this.render();
                this.makePag();
                this.selectPag();

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

    controlPage(page) {

        console.log(page);

        if(page != 1)
            document.querySelector('#heroBox-1').setAttribute('style', 'display: none;');

        if(this.beforePage) {
                this.beforePage.setAttribute('style', 'display: none;');
        }

        const selectPage = document.querySelector(`#heroBox-${page}`);

        this.beforePage = selectPage;

        selectPage.removeAttribute('style');
    }

    selectPag() {
        const pagesEl = document.querySelectorAll('#pagination a');
        let page = 1;

        pagesEl.forEach(item => {

            item.onclick = () => {

                if(!isNaN(item.innerText)) {

                    page = item.innerText;

                    this.controlPage(page);
                }

                else {

                    if(item.innerText == '<<') {

                        if(page == 1) {
                            page = 2;
                        }

                        page--;

                        this.controlPage(page);

                    }

                    else if(item.innerText == '>>') {

                        if(page == this.pag) {
                            page = this.pag - 1;
                        }

                        page++;

                        this.controlPage(page);
    
                    }
                }
            }
        });
    }

    makePag() {

        const minorSig = document.createElement('a');
        minorSig.setAttribute('href', '#');
        minorSig.appendChild(document.createTextNode('<<'));

        this.paginationEl.appendChild(minorSig);

        for(let i = 1; i <= this.pag; i++) {
            const aEl = document.createElement('a');
            aEl.setAttribute('href', '#');
            aEl.appendChild(document.createTextNode(`${i}`));

            this.paginationEl.appendChild(aEl);

        }

        const majorSig = document.createElement('a');
        majorSig.setAttribute('href', '#');
        majorSig.appendChild(document.createTextNode('>>'));

        this.paginationEl.appendChild(majorSig);
    }

    render() {

        this.cont = 0;
        this.pag = 0;

        this.hero.forEach(hero => {

            if(this.cont % 15 == 0) {

                this.pag++;

                this.boxEll = document.createElement('div');
                this.boxEll.setAttribute('class', 'heroes');
                this.boxEll.setAttribute('id', `heroBox-${this.pag}`);

                if(this.pag != 1) {
                    this.boxEll.setAttribute('style', 'display: none;');
                }
            
            }

            this.cont++;

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

            this.boxEll.appendChild(boxEl);

            this.containerHeroBoxEl.appendChild(this.boxEll);

        });

    }

}

new App();