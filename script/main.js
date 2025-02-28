let resultArr = [];
let resultArr2 = [];
let history = [];

(() => {
  let historyText = sessionStorage.getItem("history");
  if (historyText !== null) {
    historyBox.innerText = historyText;
  }
})();

// change result value
const changeResultValue = (item) => {
  let newKey = item.id;
  
  // hit equal
  if (newKey === "equal") {
    history = [...resultArr, ...resultArr2];
    resultArr = [];
    resultArr2 = [];
    
    let historyStr = convert2String(history);
    console.log("####################");
    console.log("History: ", historyStr);
    historyBox.innerText = historyStr + " = ";
    sessionStorage.setItem("history", historyStr + " = ");
    
    resultArr.push(...calculate(history));
  }
  else {
    // if result show Error
    if (resultArr.length > 0 && symbol[resultArr[0]][1] == 9) {
      resultArr.pop();
    }
    
    // first key input
    if (findNumberSet(resultArr).length === 0) {
      if (newKey === "num-thousand") {
        newKey = "num-zero";
      }
      else if (newKey === "num-dot") {
        resultArr.push("num-zero");
      }
    }
    
    let combinationOrigin;
    
    [newKey, combinationOrigin] = parsingCombination(newKey);
    
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
      
    }
  }
  setResultValue();
};

// parsing 000, ()
const parsingCombination = (newKey) => {
  
  if (symbol[newKey][1] == 8) {
    if (newKey == "num-thousand") {
      return ["num-zero", newKey];
    }
    else if (newKey == "op-parentheses") {
      return ["op-open", newKey];
    }
  }
  
  return [newKey, undefined];
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


// append, replace, prevent new key
const isNewKeyValid = (newKey) => {
  if (!symbol[newKey]) {
    console.log("invalid key: ", newKey);
  }
  
  if (resultArr.length === 0) {
    return true;
  }
  else if (isZeroDotValid(newKey)) {
    // prevent 1.1.1 and 0000
    
    let previousKey = resultArr[resultArr.length - 1];
    let checkSum = symbol[previousKey][1] * 10 + symbol[newKey][1];
    let numSet = findNumberSet(resultArr);
    
    // invalid, replace: 01 -> 1
    if (checkSum === 0 && numSet.length === 1 && numSet[0] === "num-zero") {
      resultArr.pop();
      return true;
    }
    
    // valid
    else if (validList.includes(checkSum)) {
      return true;
    }
    
    // invalid, replace: +- -> -
    else if (replaceList.includes(checkSum)) {
      resultArr.pop();
      return true;
    }
  }
  
  return false;
};

// find a set of numbers for dot
// 1+2.34 => 2.34
const findNumberSet = (arr) => {
  let numSet = [];
  // start at end point
  for (let i = arr.length - 1; i >= 0; i--) {
    
    id = arr[i];
    type = symbol[id][1];
    
    // if key is number or dot
    if (type === 0 || type === 2) {
      numSet.push(id);
    }
    else {
      break;
    }
  }
  numSet.reverse();
  
  return numSet;
}

// hidden multiply
const parsingHiddenMultiply = (key) => {
  resultArr.push("op-multiple");
};

// set result array on html
const setResultValue = () => {
  resultArr2.unshift("space");
  
  resultBox.innerHTML = [...resultArr, ...resultArr2].map(item => symbol[item][0]).join('').replace(symbol["space"][0], `<span class="blink">${symbol["space"][0]}</span>`);
  
  resultArr2.shift();
  
  updateScroll();
};

// prevent 1.1.1 and 000
const isZeroDotValid = (newKey) => {
  
  let numSet = findNumberSet(resultArr);
  
  // prevent 1.1.1.
  if (newKey === "num-dot" && numSet.includes("num-dot")) {
    return false;
  }
  // prevent 00
  if (newKey === "num-zero" && numSet.length === 1 && numSet[0] === "num-zero") {
    return false;
  }
  
  return true;
}