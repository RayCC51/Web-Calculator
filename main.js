/* symbol["..."][1]: is it valid new key append after last key, else replace last key
Digit code: 
  symbol: 
    previous key can be : hidden multiply
  _: can starts with
0: 1: 1 . + - log ( _ : pi )
1: pi: + - log ( _ : 1 pi )
2: .: 1 _ :
3: +: 1 pi ) :
4: -: 1 pi log ( ) _ :
5: log: + - log ( _ : 1 pi )
6: (: + - log ( _ : 1 pi )
7: ): 1 pi ( ) : 
8: combination
9: equal
*/
const symbol = {
  "num-one": ["1", 0],
  "num-two": ["2", 0],
  "num-three": ["3", 0],
  "num-four": ["4", 0],
  "num-five": ["5", 0],
  "num-six": ["6", 0],
  "num-seven": ["7", 0],
  "num-eight": ["8", 0],
  "num-nine": ["9", 0],
  "num-zero": ["0", 0],
  "num-thousand": ["000", 8],
  "num-dot": [".", 2],
  "num-pi": ["π", 1],
  "num-e": ["e", 1],
  "op-parentheses": ["()", 8],
  "op-open": ["(", 6],
  "op-close": [")", 7],
  "op-log": ["log", 5],
  "op-plus": ["+", 3],
  "op-minus": ["-", 4],
  "op-multiple": ["*", 3],
  "op-divide": ["/", 3],
  "op-power": ["^", 3],
  "op-mod": ["%", 3],
  "equal": ["=", 9],
};
// thousand -> zero zero zero
// parentheses -> open close

// result
const resultBox = document.getElementById("result");
let resultArr = [];

// change result value
const changeResultValue = (item) => {
  let newKey = item.id;
  // if(resultArr.length > 0){
  //   isNewKeyValid(newKey);
  // }
  if (true) {
    resultArr.push(newKey);
    //console.log(symbol[newKey][0]);
  } else{
    resultArr.pop();
    resultArr.push(newKey);
  }
  setResultValue();
};

// true will append new key, false will replace last key
const isNewKeyValid = (newKey) => {
  let checkSum = symbol[resultArr[resultArr.length-1]][1] * 10 + symbol[newKey][1];
  // console.log(checkSum);
  // console.log(resultArr[resultArr.length-1]);
  
  // TODO: switch to filter valid, unvalid, hidden multiply. 
}

// 000, log, () -> 0-0-0, log(-), (-)
// . -> 0.
const isCombination = (key) => {
  
}

// set result array on html
const setResultValue = () => {
  resultBox.textContent = resultArr.join('');
}


// on button click
const allBtn = document.querySelectorAll(".btn");

allBtn.forEach(item => {
  if (item.classList.contains("cursor")) {
    item.onclick = () => console.log(item.id);
  }
  else {
    item.onclick = () => changeResultValue(item);
  }
});


// copy result

let touchTimer;

resultBox.addEventListener('touchstart', (event) => {
    touchTimer = setTimeout(() => {
        copyText(resultBox);
    }, 350);
});

resultBox.addEventListener('touchend', () => {
    clearTimeout(touchTimer);
});

function copyText(item) {
    let original = item.textContent;
    
    const textarea = document.createElement('textarea');
    textarea.value = original;
    document.body.appendChild(textarea); 
    textarea.select(); 
    document.execCommand('copy');
    document.body.removeChild(textarea);

    item.textContent = "Copy!";
    setTimeout(() => {
        item.textContent = original;
    }, 700);
}