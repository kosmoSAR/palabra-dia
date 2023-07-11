import { fromEvent, timer } from "rxjs";
import { map, filter, tap } from "rxjs/operators";
import WORD_LIST from "./wordsList.json";

const restartButton = document.getElementById('restart-button');
const letterRows = Array.from(document.getElementsByClassName('letter-row'))
const messageText = document.getElementById("message-text")

const onKewDown$ = fromEvent(document, "keydown").pipe(
	map( event => event.key),
	filter( (event) => event.length === 1 && event.match(/[a-z]/i) ),
);

const deleteLetter$ = fromEvent(document, "keydown").pipe(
	map( event => event.key),
	filter( (event) => event === "Backspace" )
);

const checkWord$ = fromEvent(document, "keydown").pipe(
	map( event => event.key),
	filter( (event) => event === "Enter" )
);

const restart$ = fromEvent(restartButton, "click");

let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer= [];
const getRandomWord = () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
let rigthWord = getRandomWord();
console.log(rigthWord);

const insterLetter = {
	next: (event) => {
		const pressKey = event.toUpperCase();
		let letterBox = letterRows[letterRowIndex].children[letterIndex];

		if (letterIndex < 5) {
			letterBox.textContent = pressKey;
			letterBox.classList.add("filled-letter")
			userAnswer.push(pressKey)
			letterIndex++;
		}
	}
}

const deleteLetter = {
	next: () => {
		if (letterIndex !== 0) {
			let letterBox = letterRows[letterRowIndex].children[letterIndex-1];
			letterBox.textContent = null;
			letterBox.classList.remove("filled-letter")
			userAnswer.pop()
			letterIndex--;		
		}
	}
}

const checkWord = {
	next: () => {
		if ( userAnswer.length === 5 ) {
			if (userAnswer.join("") === rigthWord) {
				let letterRowsWinned = letterRows[letterRowIndex];
				for (let i = 0; i < 5; i++) {
					letterRowsWinned.children[i].classList.add("letter-green");
				}
				messageText.textContent = "Si la palabra " + rigthWord + " es correcta!"
			} else {
				messageText.textContent = "¡Te faltan algunas letras!"
				for (let i = 0; i < 5; i++) {
					let letterPosition = Array.from(rigthWord).indexOf(userAnswer[i])
					if ( letterPosition === -1) {
						letterRows[letterRowIndex].children[i].classList.add("letter-grey")
					} else {
						if ( userAnswer[i] === rigthWord[i] ) {
							letterRows[letterRowIndex].children[i].classList.add("letter-green")
						} else {
							letterRows[letterRowIndex].children[i].classList.add("letter-yellow")
						}
					}
				}
				if (letterRowIndex < 5) {
					letterRowIndex++;
					letterIndex = 0
					userAnswer = [];
				} else {
					messageText.textContent = "La palabra correcta era " + rigthWord;
					return;
				}			
			}			
		} else {
			messageText.textContent = "Te falta colocar " + userAnswer.length + " letras"
			return;
		}		
	},
}

const restartGame = {
	next: () => {
		window.location.href = "./index.html";
	}
}

onKewDown$.subscribe(insterLetter);
checkWord$.subscribe(checkWord);
deleteLetter$.subscribe(deleteLetter);
restart$.subscribe(restartGame);