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
9: equal, empty
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
  "op-ln": ["ln", 5],
  "op-plus": ["+", 3],
  "op-minus": ["-", 4],
  "op-multiple": ["*", 3],
  "op-divide": ["/", 3],
  "op-power": ["^", 3],
  "op-mod": ["%", 3],
  "op-root": ["√", 5],
  "equal": ["=", 9],
  "space": ["_", 9],
};
// thousand -> zero zero zero
// parentheses -> open close

// result init
const resultBox = document.getElementById("result");
let resultArr = [];
let resultArr2 = [];

// first digit: before key
// second digit: after key
const validList = [0, 2, 3, 4, 7, 13, 14, 17, 20, 30, 31, 35, 36, 40, 41, 45, 46, 50, 51, 54, 55, 56, 60, 61, 64, 65, 66, 67, 73, 74, 77];
const hiddenMultiplyList = [1, 5, 6, 10, 11, 15, 16, 70, 71, 75, 76];
const replaceList = [23, 24, 25, 26, 27, 33, 34, 37, 43, 44, 47]; // 09 -> 9

// change result value
const changeResultValue = (item) => {
  let newKey = item.id;
  let combinationOrigin;
  // if(resultArr.length > 0){
  //   isNewKeyValid(newKey);
  // }
  
  // first key input
  if (findNumberSet().length === 0) {
    if (newKey == "num-thousand") {
      newKey = "num-zero";
    }
  }
  
  [newKey, combinationOrigin] = parsingCombination(newKey, combinationOrigin);
  
  if (isNewKeyValid(newKey)) {
    if (combinationOrigin) {
      pushCombination(combinationOrigin);
    }
    else {
      resultArr.push(newKey);
    }
    //console.log(symbol[newKey][0]);
  } else { // FIXME -(-( + -> -(-+
    // resultArr.pop();
    // resultArr.push(newKey);
  }
  
  setResultValue();
};

// parsing 000, ()
const parsingCombination = (newKey, combinationOrigin) => {
  
  if (symbol[newKey][1] == 8) {
    //console.log(newKey);
    if (newKey == "num-thousand") {
      newKey = "num-zero";
      combinationOrigin = "num-thousand";
    }
    else if (newKey == "op-parentheses") {
      newKey = "op-open";
      combinationOrigin = "op-parentheses";
    }
  }
  
  return [newKey, combinationOrigin];
};

const pushCombination = (combinationOrigin) => {
  if (combinationOrigin == "num-thousand") {
    resultArr.push("num-zero");
    resultArr.push("num-zero");
    resultArr.push("num-zero");
  }
  else if (combinationOrigin == "op-parentheses") {
    resultArr.push("op-open");
    resultArr.push("op-close");
  }
};


// true will append new key, false will replace last key
const isNewKeyValid = (newKey) => {
  if(!symbol[newKey]){
    console.log("invalid key: ", newKey);
  }
  
  if (resultArr.length == 0) {
    if (symbol[newKey][1] != 3 && symbol[newKey][1] != 7) {
      return true;
    }
  }
  else {
    // prevent 1.1.1 and 0000
    if (newKey === "num-zero" || newKey === "num-dot") {
      if (!isZeroDotValid(newKey)) {
        return false;
      }
    }
    let previousKey = resultArr[resultArr.length - 1];
    let checkSum = symbol[previousKey][1] * 10 + symbol[newKey][1];
    // console.log(checkSum);
    // console.log(resultArr[resultArr.length-1]);
    
    let numSet = findNumberSet();
    
    // invalid, replace: 01 -> 1
    if (checkSum === 0 && numSet.length === 1 && numSet[0] === "num-zero"){
      console.log(checkSum);
      resultArr.pop();
      return true;
    }
    
    else if (validList.includes(checkSum)) {
      return true;
    }
    else if (hiddenMultiplyList.includes(checkSum)) {
      parsingHiddenMultiply(newKey);
      return true;
    }
    
    // invalid, replace: +- -> -
    // FIXME -(-(-+ -> -(-(+
    else if (replaceList.includes(checkSum)) {
      resultArr.pop();
      return true;
    }
    
    else {
      return false;
    }
  }
};

// prevent 1.1.1 and 000
const isZeroDotValid = (newKey) => {
  // console.log(newKey);
  let numSet = findNumberSet();
  // console.log(numSet);
  // prevent 1.1.1.
  if (newKey === "num-dot" && numSet.includes("num-dot")) {
    return false;
  }
  // prevent 00, allow 0.00
  if (newKey === "num-zero" && numSet.length === 1 && numSet[0] === "num-zero" && !numSet.includes("num-dot")) {
    return false;
  }
  
  return true;
}

// find a set of numbers
// (47)log48-292 => 292
// start at end point
const findNumberSet = () => {
  let numSet = [];
  for (let i = resultArr.length - 1; i >= 0; i--) {
    // console.log(resultArr[i]);
    id = resultArr[i];
    type = symbol[id][1];
    // console.log(id, type);
    // if key is number or dot
    if (type === 0 || type === 2) {
      numSet.push(id);
    }
    else {
      break;
    }
  }
  numSet.reverse();
  // console.log(numSet);
  return numSet;
}

// hidden multiply
const parsingHiddenMultiply = (key) => {
  resultArr.push("op-multiple");
};

// set result array on html
const setResultValue = () => {
  if (resultArr2.length > 0){
    resultArr2.unshift("space");
  }
  
  let temp = [];
  let unionResult = [...resultArr, ...resultArr2];
  
  for (let item of unionResult) {
    //console.log(item);
    temp.push(symbol[item][0]);
  }
  resultBox.textContent = temp.join('');
  
  if(resultArr2.length > 1){
    resultArr2.shift()
  }
};

// backspace
const popLastElement = () => {
  if (resultArr.length) {
    resultArr.pop();
    setResultValue();
  }
};

const cursorHandler = (item) => {
  // backspace
  if (item.id == "cursor-backspace") {
    let intervalId;
    let delay = 400;
    
    item.onclick = () => {
      popLastElement();
    };
    
    const startPoppingInterval = () => {
      intervalId = setInterval(() => {
        popLastElement();
        if (delay > 20) {
          // delay -= 50; 
          delay = Math.max(delay / 2, 20);
          clearInterval(intervalId);
          intervalId = setInterval(() => {
            popLastElement();
          }, delay);
        }
      }, delay);
    };
    
    const stopPoppingInterval = () => {
      clearInterval(intervalId);
      delay = 300;
    };
    
    item.onmousedown = startPoppingInterval;
    item.ontouchstart = startPoppingInterval;
    item.onmouseup = stopPoppingInterval;
    item.ontouchend = stopPoppingInterval;
    item.onmouseleave = stopPoppingInterval;
    item.ontouchcancel = stopPoppingInterval;
    
  }
  // ac
  else if (item.id == "cursor-ac") {
    item.onclick = () => {
      //console.log("all clear");
      resultArr = [];
      resultArr2 = [];
      setResultValue();
    };
  }
  // move cursor
  else if(item.id === "cursor-left"){
    item.onclick = () => {
      if(resultArr.length > 0){
    resultArr2.unshift(resultArr.pop());
    setResultValue();}
    };
  }
  else if (item.id === "cursor-right" ){
    item.onclick = () => {
      if(resultArr2.length > 0){
    resultArr.push(resultArr2.shift());
    setResultValue();
    }};
  }
  else{
    console.log("wrong cursor key input: ", item.id);
  }
};


// on button click
const allBtn = document.querySelectorAll(".btn");

allBtn.forEach(item => {
  if (item.classList.contains("cursor")) {
    cursorHandler(item);
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
  
  original = original.replace(symbol["space"][0], "");
  
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