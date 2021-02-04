// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


const pickFromArrayAndSplice = (arr) => {
  let randomIdx=Math.floor(Math.random() * arr.length );
  let randomPick= arr[randomIdx]
  arr.splice(randomIdx,1)
  return randomPick;
 }

async function getCategoryIds() {

  const getIds = await axios.get('http://jservice.io/api/categories?count=50');

  let arrayOfIds = getIds.data.map(id => {
    return id.id
    //return id.id
  })

  let newArr = [];

  for (let i = 0; i < 6; i++) {
    
    //let randomId = arrayOfIds[Math.floor(Math.random() * 50)];
    let randomId = pickFromArrayAndSplice(arrayOfIds)
    newArr.push(randomId);
  }

  return newArr;
  //console.log(getIds);
  //let randomId = Math.floor(Math.random() * arrayOfIds.length )

  //console.log(arrayOfIds);
  //return arrayOfIds;
}


async function getCategory(catId) {

  let getInfo = await axios.get(`http://jservice.io/api/category?id=${catId}`);

  let title = getInfo.data.title;
  let clues = getInfo.data.clues;

  //let cluesArr = clues.map(info => ({
  //  question: info.question,
  //  answer: info.answer,
  //  showing: null
  //}))
   cluesArr=[];
   for(let i=0;i<5;i++)
   {
    let randomClue= pickFromArrayAndSplice(clues)
    //console.log(randomClue.question)
    cluesArr.push({
      question: randomClue.question,
      answer: randomClue.answer,
      showing:null
    })
   }

  let categoryData = {
    title: title,
    clues: cluesArr
  }

  categories.push(categoryData);
  return;
  //return categories;
  //will push this onto categories variable

}


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */


 function fillTable() {

  let tbl = document.createElement('table');
  let tblBody = document.createElement('tbody');
  let gameBody = document.getElementById('game-body')
  let thead = document.createElement('thead');

  tbl.style.marginLeft = 'auto';
  tbl.style.marginRight = 'auto';

  //create cells
  for (let r = 0; r < 5; r++) {
    let row = document.createElement('tr');

    for (let c = 0; c <= 5; c++) {
      let cell = document.createElement('td');
      cell.id= `${r}-${c}`

      cell.innerText = `?`
      
      cell.addEventListener("click",handleClick)


      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }

  for (let i=0;i<6;i++){
    let newth= document.createElement('th');
    newth.innerText=categories[i].title;
    //newth.innerText= "Category" + i;
    thead.appendChild(newth);
  }



  tbl.appendChild(thead);
  tbl.appendChild(tblBody);
  gameBody.appendChild(tbl);


  //firstRow.innerText = categories.title;

  //gameBody.append(firstRow);


  //let catId = await getCategoryIds();
  //getCategory(catId);

}



/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let rowIdx = evt.target.id.split("-")[0]
  let colIdx = evt.target.id.split("-")[1]
  console.log("clicked");
  let myQtarget= categories[colIdx].clues[rowIdx];

  let myShowingValue= myQtarget.showing;

  if(!myShowingValue)
  {
    evt.target.innerText=myQtarget.question;
    myQtarget.showing="question"
  }
  if(myShowingValue=="question")
  {
    evt.target.innerText=myQtarget.answer;
    myQtarget.showing="answer"
    evt.target.removeEventListener("click",handleClick)
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

//function showLoadingView() {

//}

/** Remove the loading spinner and update the button used to fetch data. */

//function hideLoadingView() {
//}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */




async function setupAndStart() { 

//get ids first
//loop on the different ids
//push category data into categories array
//call filltable method
let myIds= await getCategoryIds();
for (id of myIds) {
  await getCategory(id)
}

//wait for categories before continuing
//console.log(categories)
fillTable();
}



  document.querySelector("#startbt").addEventListener("click",function(){
    setupAndStart();
    
    this.style.visibility = "hidden";
  })