let resultArr = [];
let resultArr2 = [];
let history = []; // TODO

// change result value
const changeResultValue = (item) => {
  let newKey = item.id;
  let combinationOrigin;
  // if(resultArr.length > 0){
  //   isNewKeyValid(newKey);
  // }
  
  // hit equal
  if (newKey === "equal") {
    history = [...resultArr, ...resultArr2];
    resultArr = [];
    resultArr2 = [];
    
    console.log("history: ", convert2String(history));
    historyBox.innerText = convert2String(history);
    
    resultArr.push(...calculate([...history]));
  }
  else {
    // if result show Error
    if (resultArr.length > 0 && symbol[resultArr[0]][1] == 9) {
      resultArr.pop();
    }
    
    // first key input
    if (findNumberSet(resultArr).length === 0) {
      if (newKey == "num-thousand") {
        newKey = "num-zero";
      }
      if (newKey == "num-dot") {
        resultArr.push("num-zero");
      }
    }
    
    [newKey, combinationOrigin] = parsingCombination(newKey, combinationOrigin);
    
    if (isNewKeyValid(newKey)) {
      if (combinationOrigin) {
        pushCombination(combinationOrigin);
      }
      else {
        resultArr.push(newKey);
        
        if (symbol[newKey][1] === 5) {
          // add () after log ln sqrt
          pushCombination("op-parentheses");
        }
      }
      //console.log(symbol[newKey][0]);
    } else {
      // resultArr.pop();
      // resultArr.push(newKey);
    }
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
    resultArr2.unshift("op-close");
  }
};


// true will append new key, false will replace last key
const isNewKeyValid = (newKey) => {
  if (!symbol[newKey]) {
    console.log("invalid key: ", newKey);
  }
  
  // +/*) can not be first key
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
    
    let numSet = findNumberSet(resultArr);
    
    // invalid, replace: 01 -> 1
    if (checkSum === 0 && numSet.length === 1 && numSet[0] === "num-zero") {
      console.log(checkSum);
      resultArr.pop();
      return true;
    }
    
    else if (validList.includes(checkSum)) {
      // if (hiddenMultiplyList.includes(checkSum)) {
      // parsingHiddenMultiply(newKey);
      // }
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

// find a set of numbers for dot
// (47)log48-292 => 292
// start at end point
const findNumberSet = (arr) => {
  let numSet = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    // console.log(resultArr[i]);
    id = arr[i];
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
  resultArr2.unshift("space");
  
  let unionResult = [...resultArr, ...resultArr2];
  /*
  for (let item of unionResult) {
    //console.log(item);
    temp.push(symbol[item][0]);
  }
  */
  let changeCalOp = unionResult.map(item => {
    if(symbol[item][1] === "x"){
      return symbol[item][2];
    }
    return item;
  });
  
  // let temp = unionResult.map(item => symbol[item][0]);
  let temp = changeCalOp.map(item => symbol[item][0]);
  
  // resultBox.textContent = temp.join('');
  let spaceSymbol = symbol["space"][0];
  
  resultBox.innerHTML = temp.join('').replace(spaceSymbol, `<span class="blink">${spaceSymbol}</span>`);
  
  resultArr2.shift();
  
  updateScroll();
};
