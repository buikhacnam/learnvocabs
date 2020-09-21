// Speaker:

const voiceList = document.querySelector('#voiceList');
const btnSpeak = document.querySelector('#btnSpeak');
let synth = window.speechSynthesis;
let voices = [];

if(speechSynthesis !== undefined){
            speechSynthesis.onvoiceschanged = PopulateVoices;
}

function PopulateVoices(){
            voices = synth.getVoices();
            let selectedIndex = voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
            voiceList.innerHTML = '';
            
            voices.forEach((voice)=>{
                let listItem = document.createElement('option');
                listItem.textContent = voice.name;
                
               listItem.setAttribute('data-lang', voice.lang);
               listItem.setAttribute('data-name', voice.name);
                voiceList.appendChild(listItem);
                
            });

          voiceList.selectedIndex = selectedIndex;
}

PopulateVoices();


btnSpeak.addEventListener('click', speakNow);

function speakNow() {
	let toSpeak = new SpeechSynthesisUtterance(say);
            let selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
       
            voices.forEach((voice)=>{
                if(voice.name === selectedVoiceName){
                    toSpeak.voice = voice;
                }
            });
            synth.speak(toSpeak);
}

function speakId(title) {
	let toSpeak = new SpeechSynthesisUtterance(title);
            let selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
       
            voices.forEach((voice)=>{
                if(voice.name === selectedVoiceName){
                    toSpeak.voice = voice;
                }
            });
            synth.speak(toSpeak);
}



//filter the unwiped item:
let say = "nothing to say";
let newArr = [];
function ulList(arr) {
	if(arr) {
	let unwipedList = arr.filter(num => {
		return num.trash == false;
	})
	
	let random;
	do {
		random = randomGenerator(unwipedList);
	} while (newArr.includes(random));
		newArr.push(random);
		console.log(newArr);
		if(newArr.length == unwipedList.length && unwipedList.length > 1){
			newArr = [];
		}
	say = unwipedList[random].title;
	getHint(unwipedList[random].meaning);
	}
}

function randomGenerator(arr) {
	return Math.floor(Math.random() * arr.length);
}



//input answer:
const fill = document.getElementById('fill');
const btnNext = document.getElementById('btnNext');
const status = document.getElementById('status');
const hint = document.getElementById('hint');
const confirm = document.getElementById('confirm');
const form = document.querySelector('.form-control');

fill.addEventListener("keypress", handleAnswer);

function handleAnswer(e) {
	if (e.which == 13 || e.keyCode == 13) {
		let result = (fill.value).toLowerCase();
		checkResult(result);
		result == "";
	}
}

function checkResult(result) {
	if (result === say) {
		setSuccessFor(fill);

	} else {
		setErrorFor(fill);
	}
}

function setSuccessFor(input) {
	const formControl = input.parentNode;
	formControl.className = "form-control success";
	speakId(`oh yes ${say} `)

}

function setErrorFor(input) {
	const formControl = input.parentNode;
    formControl.className = "form-control error";
    speakId(`no no not ${fill.value}`)
}


btnNext.addEventListener("click", handleNext);

function handleNext() {
	if(ul.length > 1) {
		ulList(ul);
		form.className = "form-control";
		fill.value= "";
		
	} else if (ul.length == 1){
		location.reload();
	} 
	
}

function getHint(word){
	return hint.innerText = `Vietnamese: "${word}"`;
}

window.addEventListener('load', () => {
	ulList(ul);
});



// -----------------------List-------------------------------
const clear = document.getElementById("clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const input2 = document.getElementById("input2");
const plus = document.getElementById("plus");

//submitting a new item by clicking the plus icon:
plus.addEventListener("click", newTodo); 

// this ul array contains all the items on the list:
let ul;

//get data from the key "main" from localstorage: 
let data = localStorage.getItem("main");

if(data){
    ul = JSON.parse(data); // convert a "string" object to a real object
    load(ul);   // load each of the object in ul array
} else  {
    ul = [];
}

function load(array) {
	array.forEach(obj => {
		addTodo(obj);
	})
}




//set up object item and push it in ul array and display function (addTodo):
function newTodo(event) {
	if (ul.length < 1) {
		location.reload();
	}

	let meaning = input2.value;
	
	let li = {
		title: "",
		meaning: meaning,
		trash: false,
		done: false,
		id: ul.length	
	}

	if(event.target.attributes.id.value == "plus") {
		const title = (input.value).toLowerCase();
		if (title == "") {
			input.blur();
		} else {
			li.title = title;
			ul.push(li);
			addTodo(li);
		}	
	}	
}

//display the list:
function addTodo(obj) {
	if (obj.trash == false) {
	const position = "afterbegin";
		if (!obj.done) {
			obj.textStatus = "";
			obj.doneStatus = "done";
			obj.eraseStatus = "";
		} else {
			obj.textStatus = "text-complete";
			obj.doneStatus = "after-done";
			obj.eraseStatus = "after-erase";
		}
	const item = ` <li class="item">
                     <p class="text ${obj.textStatus}">${obj.title}</p>
                     <p class="${obj.doneStatus}"><i class="fas fa-volume-up" job="complete" id="${obj.id}"></i></p>
                     <i class="fas fa-trash-alt erase ${obj.eraseStatus}" job="delete" id="${obj.id}"></i>  
                     <p class="meaning">${obj.meaning}</p>
               		</li>`;
		list.insertAdjacentHTML(position, item);
		localStorage.setItem("main", JSON.stringify(ul));
		input.value = "";
		input2.value="";
	} else {
		return "";
	}
}

// when you click on "done" or "trash" icon:
list.addEventListener("click", function(event)  {
	const element = event.target;
	const deleteOrComplete = element.attributes.job.value;

	if(deleteOrComplete == "complete"){
		completeTodo(element);
	} else if (deleteOrComplete == "delete"){
		deleteTodo(element);
	}
	localStorage.setItem("main", JSON.stringify(ul));
})

// toggle classes of the item when it's done or deleted & update the local storage:

function completeTodo(element) {
    let title = ul[parseInt(element.attributes.id.value)].title
    speakId(title);
}

function deleteTodo(element) {
	element.parentNode.classList.toggle("erase-transition");
	
	ul[parseInt(element.attributes.id.value)].trash = true;
	
	setTimeout(() => {
		element.parentNode.parentNode.removeChild(element.parentNode);
	}, 700);
}

// reset:
clear.addEventListener("click", reset);

function reset() {
	window.localStorage.removeItem("main");
	window.localStorage.removeItem("titleList");
	location.reload();
}

///////////////////////////////////////////////////////////////////////////
