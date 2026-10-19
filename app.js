/*-------------------------------- Constants --------------------------------*/
const players = {
    easy: [
        { name: 'Lionel Messi', clues: ['I am from Argentina.', 'I played for Barcelona.', 'I won the World Cup in 2022.'] },
        { name: 'Cristiano Ronaldo', clues: ['I am from Portugal.', 'I played for Real Madrid.', 'I celebrate by shouting "Siuuu!"'] },
        { name: 'Neymar', clues: ['I am from Brazil.', 'I played for Barcelona and Paris Saint-Germain.', 'I started my career at Santos.'] },
        { name: 'Kylian Mbappe', clues: ['I am from France.', 'I won the World Cup at age 19.', 'I joined Real Madrid in 2024.'] },
        { name: 'Mohamed Salah', clues: ['I am from Egypt.', 'I play for Liverpool.', 'I am called the Egyptian King.'] },
        { name: 'Erling Haaland', clues: ['I am from Norway.', 'I play for Manchester City.', 'I scored 36 Premier League goals in my first season.'] },
        { name: 'David Beckham', clues: ['I am from England.', 'I played for Manchester United and Real Madrid.', 'I was famous for my free kicks and my number 7 shirt.'] },
        { name: 'Diego Maradona', clues: ['I am from Argentina.', 'I scored the "Hand of God" goal.', 'I won the World Cup in 1986.'] },
        { name: 'Pele', clues: ['I am from Brazil.', 'I won the World Cup three times.', 'I am called the King of Football.'] },
        { name: 'Zinedine Zidane', clues: ['I am from France.', 'I played for Juventus and Real Madrid.', 'I headbutted a player in the 2006 World Cup final.'] }
    ],
    medium: [
        { name: 'Luka Modric', clues: ['I am a midfielder.', 'I am from Croatia.', 'I won the Ballon d\'Or in 2018.'] },
        { name: 'Kevin De Bruyne', clues: ['I am a midfielder famous for my passing.', 'I am from Belgium.', 'I played for Chelsea, Wolfsburg and Manchester City.'] },
        { name: 'Manuel Neuer', clues: ['I am a goalkeeper.', 'I am from Germany.', 'I won the World Cup in 2014.'] },
        { name: 'Robert Lewandowski', clues: ['I am a striker.', 'I am from Poland.', 'I played for Bayern Munich and Barcelona.'] },
        { name: 'Heung-min Son', clues: ['I am a forward.', 'I am from South Korea.', 'I won the Premier League Golden Boot in 2022.'] },
        { name: 'Thierry Henry', clues: ['I am a forward.', 'I am from France.', 'I am Arsenal\'s all-time top scorer.'] },
        { name: 'Ronaldinho', clues: ['I am a forward famous for my skills and my smile.', 'I am from Brazil.', 'I won the Ballon d\'Or in 2005.'] },
        { name: 'Virgil van Dijk', clues: ['I am a defender.', 'I am from the Netherlands.', 'I joined Liverpool in 2018 for a record fee for a defender.'] },
        { name: 'Jude Bellingham', clues: ['I am a midfielder.', 'I am from England.', 'I joined Real Madrid in 2023.'] },
        { name: 'Gianluigi Buffon', clues: ['I am a goalkeeper.', 'I am from Italy.', 'I won the World Cup in 2006.'] }
    ],
    hard: [
        { name: 'Johan Cruyff', clues: ['I played for Ajax and Barcelona.', 'I am from the Netherlands.', 'I am famous for a turn named after me.'] },
        { name: 'Paolo Maldini', clues: ['I was a defender who played my whole career at AC Milan.', 'I am from Italy.', 'My father was also a famous Milan captain.'] },
        { name: 'Andres Iniesta', clues: ['I am a midfielder who spent most of my career at Barcelona.', 'I am from Spain.', 'I scored the winning goal in the 2010 World Cup final.'] },
        { name: 'Xavi', clues: ['I am a midfielder famous for my passing.', 'I played for Barcelona and Al Sadd.', 'I later became the manager of Barcelona.'] },
        { name: 'Sergio Ramos', clues: ['I am a defender who scores many headers.', 'I played for Sevilla, Real Madrid and Paris Saint-Germain.', 'I scored a late equalizer in the 2014 Champions League final.'] },
        { name: 'Luis Suarez', clues: ['I am a striker from Uruguay.', 'I played for Liverpool and Barcelona.', 'I was banned for biting a player at the 2014 World Cup.'] },
        { name: 'Eden Hazard', clues: ['I am a winger from Belgium.', 'I played for Lille and Chelsea.', 'I joined Real Madrid in 2019.'] },
        { name: 'Didier Drogba', clues: ['I am a striker who played for Chelsea.', 'I am from Ivory Coast.', 'I scored the equalizer in the 2012 Champions League final.'] },
        { name: 'Gareth Bale', clues: ['I am a winger from Wales.', 'I played for Tottenham and Real Madrid.', 'I scored an overhead kick in the 2018 Champions League final.'] },
        { name: 'Roberto Baggio', clues: ['I am an Italian forward with a famous ponytail.', 'I played for Juventus and AC Milan.', 'I missed the decisive penalty in the 1994 World Cup final.'] }
    ]
};


const difficulties = {
    easy: 5,
    medium: 3,
    hard: 2
};


/*---------------------------- Variables (state) ----------------------------*/
let deck;
let index;
let clueCount;
let lives;
let score;
let gameOver;
let highScore = Number(localStorage.getItem('highScore')) || 0;
let audioCtx;


/*------------------------ Cached Element References ------------------------*/
const messageEl = document.querySelector('#message');
const roundEl = document.querySelector('#round');
const scoreEl = document.querySelector('#score');
const livesEl = document.querySelector('#lives');
const cluesEl = document.querySelector('#clues');
const formEl = document.querySelector('#guess-form');
const guessEl = document.querySelector('#guess');
const guessBtnEl = document.querySelector('#guess-btn');
const clueBtnEl = document.querySelector('#clue-btn');
const resetBtnEl = document.querySelector('#reset');
const highScoreEl = document.querySelector('#high-score');
const themeBtnEl = document.querySelector('#theme');
const difficultyEl = document.querySelector('#difficulty');


/*-------------------------------- Functions --------------------------------*/

function init() {
    console.log('init called');

    deck = players[difficultyEl.value].slice().sort(function () {
        return Math.random() - 0.5;
    });
    index = 0;
    clueCount = 1;
    lives = difficulties[difficultyEl.value];
    score = 0;
    gameOver = false;
    guessEl.value = '';
    messageEl.textContent = 'Who is this player?';

    render();
}

function render() {
    updateStats();
    updateClues();
    updateButtons();
}


function updateStats() {
    roundEl.textContent = `${index + 1}/${deck.length}`;
    scoreEl.textContent = score;
    highScoreEl.textContent = highScore;
    livesEl.textContent = lives;
}


function updateClues() {
    cluesEl.innerHTML = '';
    let html = '';

    for (let i = 0; i < deck[index].clues.length; i++) {
        if (i < clueCount) {
            html += `<li>${deck[index].clues[i]}</li>`;
        } else {
            html += `<li>🔒 Locked clue</li>`;
        }
    }

    cluesEl.innerHTML = html;
}


function updateButtons() {
    guessBtnEl.disabled = gameOver;
    guessEl.disabled = gameOver;
    clueBtnEl.disabled = gameOver || clueCount === 3;
}





/*----------------------------- Event Listeners -----------------------------*/


