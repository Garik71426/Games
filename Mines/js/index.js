const GameBox = document.getElementById('root');
const GameSize = 15;
const MinePercent = 15;
const Percent = Math.ceil(GameSize * GameSize / 100 * MinePercent);
const VirtualBoard = [];
const ZeroHistory = [];// changed to recursve array

//When clicked field is mine
const isMine = () => {
    const Items = document.getElementsByClassName('item');
    for (let i = 0; i < GameSize; i++) {
        for(let j = 0; j < GameSize; j++) {
            if (VirtualBoard[i][j] === '*') {
                Items[i * GameSize + j].innerHTML = '<svg id="Capa_1" enable-background="new 0 0 512 512" height="50" viewBox="0 0 512 512" width="50" xmlns="http://www.w3.org/2000/svg"><path d="m121.47 202.971-43.913-42.304c-17.275-16.642-22.432-40.8-13.46-63.046 8.973-22.246 29.447-36.066 53.435-36.066h229.916v30.235h-229.916c-11.572 0-21.066 6.407-25.394 17.14-4.329 10.732-1.937 21.933 6.396 29.962l43.913 42.304z" fill="#fabc00"/><path d="m452.243 330.74c0 48.417-18.857 93.941-53.093 128.167-34.236 34.236-79.751 53.093-128.167 53.093s-93.941-18.857-128.167-53.093c-51.692-51.692-67.042-129.427-39.749-196.499l-31.404-31.404 99.585-99.585 31.394 31.404c67.082-27.292 144.817-11.943 196.509 39.749 34.235 34.237 53.092 79.751 53.092 128.168z" fill="#5b5555"/><path d="m452.243 330.74c0 48.417-18.857 93.941-53.093 128.167l-277.983-277.408 50.08-50.08 31.394 31.404c67.082-27.292 144.817-11.943 196.509 39.749 34.236 34.237 53.093 79.751 53.093 128.168z" fill="#463f3f"/><path d="m270.781 443.545c-29.191 0-56.636-11.368-77.278-32.01l21.379-21.379c14.931 14.931 34.783 23.154 55.899 23.154s40.968-8.223 55.899-23.154l21.379 21.379c-20.641 20.643-48.086 32.01-77.278 32.01z" fill="#eef5ff"/><path d="m381.289 61.555h45.689v30.235h-45.689z" fill="#f4d34e"/><path d="m381.289 76.673h45.689v15.118h-45.689z" fill="#ffa41f"/><path d="m368.77 8.242h45.689v30.236h-45.689z" fill="#f4d34e" transform="matrix(.906 -.423 .423 .906 26.865 167.81)"/><path d="m376.497 107.141h30.236v45.689h-30.236z" fill="#ffa41f" transform="matrix(.423 -.906 .906 .423 108.215 429.89)"/></svg>';
            }
        }
    }
    winOrLoss('You Loss');
}

//Right click on mouse from set mine
const setMine = (event) => {
    event.preventDefault();
    if (event.target.getAttribute('class') === 'item mine') {
        event.target.setAttribute('class', 'item');
        event.target.setAttribute('onclick', 'check(event)');
        return;
    }
    if (event.target.getAttribute('class') !== 'item opened') {
        event.target.setAttribute('class', 'item mine');
        event.target.removeAttribute('onclick', 'check(event)');
    }
}

//End game function
const winOrLoss = (message) => {
    const win = document.getElementsByClassName('win_or_lose')[0];
    document.getElementById('message').textContent = message;
    win.style.width = `${(GameSize * (3.125 + .023))}em` ;
    win.style.height = `${(GameSize * (3.125 + .023))}em`;
    win.style.display = 'flex';
}

//Function for set winning
const youWinn = () => {
    const opened = document.getElementsByClassName('item opened').length;
    if (opened === GameSize * GameSize - Percent) {
        winOrLoss('You Winn');
    }
}


//Paint in board
const paintItem = (position) => {
    let positionI = Math.floor(position / GameSize);
    let positionJ = position % GameSize;
    const Items = document.getElementsByClassName('item');
    Items[position].textContent = VirtualBoard[positionI][positionJ] !== 0 ? VirtualBoard[positionI][positionJ] : '';
    Items[position].setAttribute('class', 'item opened');
}


//new game (trial version)
const newGame = () => {
    location.reload();
}

//Checking clicked field
const open = (position) => {
    let positionI = Math.floor(position / GameSize);
    let positionJ = position % GameSize; 
    const Items = document.getElementsByClassName('item');
    if (VirtualBoard[positionI][positionJ] !== 0) {
        paintItem(position);
        youWinn();
        return;
    }
    if (ZeroHistory.indexOf(position) !== -1) {
        return;
    }
    ZeroHistory.push(positionI * GameSize + positionJ);
    paintItem(position);
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            if ((positionI + i >= 0 && positionI + i < GameSize) && (positionJ + j >= 0 && positionJ + j < GameSize)) {
                paintItem(((positionI + i) * GameSize) + positionJ + j);
                youWinn();
                if(VirtualBoard[positionI + i][positionJ + j] === 0){
                    open(((positionI + i) * GameSize) + positionJ + j);
                }
            }
        }
    }
}

//click on field 
const check = (event) => {
    const position = Number(event.target.getAttribute('aria-index'));
    const positionI = Math.floor(position / GameSize);
    const positionJ = position % GameSize;    
    if (VirtualBoard[positionI][positionJ] === '*') {
        isMine();
    } else {
        open(position,positionI,positionJ);
    }
}

//Painting
for (let i = 0; i < GameSize; i++) {
    GameBox.style.width = `${(GameSize * (3.125 + .023))}em` ;
    GameBox.style.height = `${(GameSize * (3.125 + .023))}em`;
    VirtualBoard.push([]);
    for(let j = 0; j < GameSize; j++) {
        const Div = document.createElement('div');
        Div.setAttribute('class', 'item');
        Div.setAttribute('onclick', 'check(event)'); 
        Div.addEventListener('contextmenu', setMine);        
        Div.setAttribute('aria-index', `${ i * GameSize + j }`);
        GameBox.appendChild(Div);        
        VirtualBoard[i].push(0);
    }
}

//fill mines in virtual board
const fillMines = () => {    
    for (let index = 0; index < Percent; index++) {
        let position =  Math.floor(Math.random() * (GameSize * GameSize)); 
        let positionI = Math.floor(position / GameSize);
        let positionJ = position % GameSize;
        while (VirtualBoard[positionI][positionJ] === '*') {
            position =  Math.floor(Math.random() * (GameSize * GameSize));
            positionI = Math.floor(position / GameSize);
            positionJ = position % GameSize;
        }        
        VirtualBoard[positionI][positionJ] = '*';
    }    
    fillNumbers();
}

//fill mines count in virtual board
const fillNumbers = () => {
    for (let i = 0; i < GameSize; i++) {
        for (let j = 0; j < GameSize; j++) {
            if (VirtualBoard[i][j] === '*') {
                for(let k = -1; k <= 1; k++){
                    for(let l = -1; l <= 1; l++){
                        if(VirtualBoard[i+k] && VirtualBoard[j + l] &&  VirtualBoard[i+k][j + l] !== '*' ){
                            VirtualBoard[i+k][j + l] = VirtualBoard[i+k][j + l]+1;
                        }
                    }
                }
            }
        }
    }
}

fillMines();