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
5: log √: + - log ( _ : 1 pi )
6: (: + - log ( _ : 1 pi )
7: ): 1 pi ( ) : 
8: combination
9: equal, space, error
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
  "num-i": ["i", 1],
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
  "cal-plus": ["p", "x", "op-plus"],
  "cal-minus": ["m", "x", "op-minus"],
  "cal-divide": ["d", "x", "op-divide"],
  "cal-multiple": ["t", "x", "op-multiple"],
  "cal-power": ["x", "x", "op-power"],
  "cal-open": ["o", "x", "op-open"],
  "cal-close": ["c", "x", "op-close"],
  "cal-log": ["g", "x", "op-log"],
  "cal-ln": ["n", "x", "op-ln"],
  "error-NaN": ["Not a Number", 9],
  "error-zero": ["Zero Division Error", 9],
  "error-over": ["Overflow", 9],
  "error-under": ["Underflow", 9],
  "error-syntax": ["Syntax Error", 9],
  "error-log": ["Log Undefined", 9],
  "error-complex": ["Complex Number", 9],
  "error": ["Error", 9],
};
// thousand -> zero zero zero
// parentheses -> open close

// result init
const resultBox = document.getElementById("result");
// history
const historyBox = document.getElementById("history");

// first digit: before key
// second digit: after key
const hiddenMultiplyList = [1, 5, 6, 10, 11, 15, 16, 70, 71, 75, 76];
const validList = [0, 2, 3, 4, 7, 13, 14, 17, 20, 30, 31, 35, 36, 40, 41, 45, 46, 50, 51, 54, 55, 56, 60, 61, 64, 65, 66, 67, 73, 74, 77, 1, 5, 6, 10, 11, 15, 16, 70, 71, 75, 76];
const replaceList = [23, 24, 25, 26, 27, 33, 34, 37, 43, 44, 47]; // 09 -> 9, (+ -> (

// backspace
const popLastElement = () => {
  if (resultArr.length > 1) {
    if (symbol[resultArr[resultArr.length - 1]][1] === 6 && symbol[resultArr[resultArr.length - 2]][1] === 5) {
      // if remove log( ln( √(, remove both log and open. leave close  
      resultArr.pop();
    }
  }
  resultArr.pop();
  setResultValue();
};

const cursorHandler = (item) => {
  // backspace with long press
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
      resultArr = [];
      resultArr2 = [];
      setResultValue();
    };
  }
  
  // move cursor left
  else if (item.id === "cursor-left") {
    item.onclick = () => {
      
      if (resultArr.length > 0) {
        if (symbol[resultArr[0]][1] === 9) {
          // erase error text
          resultArr.pop();
        }
        else {
          resultArr2.unshift(resultArr.pop());
        }
        setResultValue();
      }
    };
  }
  
  // move cursor right
  else if (item.id === "cursor-right") {
    item.onclick = () => {
      if (resultArr2.length > 0) {
        resultArr.push(resultArr2.shift());
        setResultValue();
      }
    };
  }
  
  else {
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
  let copy = item.textContent;
  
  let original = copy.replace(symbol["space"][0], "");
  
  if (!copy.includes("<span class=\"blink\">_</span>")) {
    copy = copy.replace(symbol.space[0], "<span class=\"blink\">_</span>");
  }
  
  const textarea = document.createElement('textarea');
  textarea.value = original;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  
  item.textContent = "Copy!";
  console.log("Copy: ", original);
  
  setTimeout(() => {
    item.innerHTML = copy;
  }, 700);
}

// whenever overflow cursor stay right end
const resultDiv = document.getElementById('result');

const updateScroll = () => {
  resultDiv.scrollLeft = resultDiv.scrollWidth;
};

// calculate 0
const fixSyntax = (arr) => {
  let modified = false;
  
  // 1. fix dot without num
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "num-dot") {
      if (i === 0) {
        console.log("Fix syntax: dot")
        arr.unshift("num-zero");
        i++;
        modified = true;
      }
      // dot without int
      else if (symbol[arr[i - 1]][1] !== 0) {
        console.log("Fix syntax: dot")
        arr.splice(i, 0, "num-zero");
        i++;
        modified = true;
      }
      // dot without float
      else if (i === arr.length - 1) {
        arr.push("num-zero");
        modified = true;
      }
      else if (symbol[arr[i + 1]][1] !== 0) {
        arr.splice(i + 1, 0, "num-zero");
        modified = true;
      }
    }
  }
  
  // 2. remove empty ()
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "op-open") {
      if (i === arr.length - 1) {
        arr.pop();
        modified = true;
      }
      else if (arr[i + 1] === "op-close") {
        // remove log() ln() sqrt()
        if (i !== 0 && symbol[arr[i - 1]][1] === 5) {
          arr.splice(i - 1, 3);
          i -= 3;
          modified = true;
        }
        // 1()2 →⁠ 1*2
        else if (i > 0 &&
          i < arr.length - 2 && [0, 1].includes(symbol[arr[i - 1]][1]) && [0, 1].includes(symbol[arr[i + 2]][1])
        ) {
          arr.splice(i, 2, "op-multiple");
          i -= 2;
          modified = true;
        }
        else {
          arr.splice(i, 2);
          i -= 2;
          modified = true;
        }
      }
    }
  }
  
  // 3. fix operator without number
  for (let i = 0; i < arr.length; i++) {
    if (symbol[arr[i]][1] === 3 || symbol[arr[i]][1] === 4) {
      if (i === 0) {
        if (arr[i] === "op-minus") {
          continue;
        }
        arr.shift();
        modified = true;
      }
      else if (i === arr.length - 1) {
        arr.pop();
        modified = true;
      }
      else if (arr[i - 1] === "op-open") {
        if (arr[i] === "op-minus") {
          continue;
        }
        arr.splice(i, 1);
        modified = true;
      }
      else if (arr[i + 1] === "op-close") {
        arr.splice(i, 1);
        modified = true;
      }
    }
  }
  
  if (modified) {
    console.log("Syntax fixed: ", convert2String(arr));
  }
  return arr;
};

// FIXME: 1e-7 -> underflow
// calculate 5
const partCalculate = (arr) => {
  // if arr has error
  let error = arr.filter(item => symbol[item][1] === 9);
  if (error.length > 0) {
    return error;
  }
  
  let answer = ["error"];
  let answerNum = 0;
  
  // pi -> Math.PI, e -> Math.E
  arr = arr.flatMap((item) => {
    if (item === "num-pi") {
      return calculateAnswer(Math.PI);
    }
    else if (item === "num-e") {
      return calculateAnswer(Math.E);
    }
    else {
      return [item];
    }
  })
  
  // split number and operator
  
  
  let head = [];
  let op = [];
  let tail = [];
  let isBeforeOp = true;
  
  // seperate operator
  for (let i = 0; i < arr.length; i++) {
    // not number, dot, pi, calculate symbol
    if (symbol[arr[i]][1] === 0 || symbol[arr[i]][1] === 1 || symbol[arr[i]][1] === 2 || symbol[arr[i]][1] === "x") {
      if (isBeforeOp) {
        head.push(arr[i]);
      }
      else {
        tail.push(arr[i]);
      }
    }
    else {
      op.push(arr[i]);
      isBeforeOp = false;
    }
  }
  
  // operator length should be 1 or 0
  if (op.length > 1) {
    console.log("ERROR: 2 operator in 1 parentheses");
    return ["error-syntax"];
  }
  else if (head[0] === "cal-minus") {
    head[0] = "op-minus";
  }
  else if (tail[0] === "cal-minus") {
    tail[0] = "op-minus";
  }
  
  let operator = op[0];
  
  
  if (head.length !== 0 && op.length === 0 && tail.length === 0) {
    // no operator, tail: just number
    answerNum = Number(convert2String(head));
  } else if (head.length === 0) {
    // no head: log ln -1
    if (operator === "op-minus") {
      answerNum = -1 * Number(convert2String(tail));
    }
    else if (operator === "op-log") {
      let num = Number(convert2String(tail));
      if (num === NaN) {
        return ["error-NaN"];
      }
      else if (num <= 0) {
        return ["error-log"];
      }
      else {
        answerNum = Math.log10(num);
      }
      
    }
    else if (operator === "op-ln") {
      let num = Number(convert2String(tail));
      if (num === NaN) {
        return ["error-NaN"];
      }
      else if (num <= 0) {
        return ["error-log"];
      }
      else {
        answerNum = Math.log(num);
      }
      
    }
    else {
      console.log("No head with op: ", operator);
      return ["error-syntax"];
    }
  }
  else if (head.length !== 0 && op.length !== 0 && tail.length !== 0) {
    // + - * / ^ %
    let headNum = Number(convert2String(head));
    let tailNum = Number(convert2String(tail));
    
    // ^
    if (operator === "op-power") {
      // power with positive
      
      if (head[0] !== "cal-minus" && head[0] !== "op-minus") {
        answerNum = Math.pow(headNum, tailNum);
        
      }
      else {
        // do not calculate complex number
        return ["error-complex"];
      }
    }
    // % / 
    else if (operator === "op-mod" || operator === "op-divide") {
      
      if (tail.length === 1 && tail[0] === "num-zero")
      {
        // zero division / mod error
        return ["error-zero"];
      }
      else {
        
        // divide
        if (operator === "op-divide") {
          answerNum = headNum / tailNum;
        }
        // mod
        else {
          answerNum = headNum % tailNum;
        }
        
      }
      
    }
    // +*  -
    else {
      if (operator === "op-multiple") {
        answerNum = headNum * tailNum;
      }
      else if (operator === "op-plus") {
        answerNum = headNum + tailNum;
      }
      else if (operator === "op-minus") {
        answerNum = headNum - tailNum;
      }
      else {
        console.log("Invaild operator: ", operator);
        return ["error"];
      }
    }
  }
  else {
    return ["error-syntax"];
  }
  
  // error handling
  if (answerNum === Infinity || answerNum.toString().includes("e+")) {
    return ["error-over"];
  }
  else if (answerNum.toString().includes("e-")) {
    return ["error-under"];
  }
  
  answer = calculateAnswer(answerNum);
  
  if (answer[0] === "op-minus") {
    answer[0] = "cal-minus";
  }
  
  return answer;
};

const calculateAnswer = (num) => {
  return convert2Symbol(truncate(num).toString());
}

// round after 10 decimal places
const truncate = (num) => {
  return Math.round(num * 1e10) / 1e10;
}

// parsing and calculating
const calculate = (exprArr) => {
  let answer = ["error"];
  
  // empty equal empty
  if (exprArr.length === 0) {
    return [];
  }
  // error equal empty
  else if (symbol[exprArr[0]][1] === 9) {
    return [];
  }
  
  // 1. count parentheses and open or close
  exprArr = countParentheses(exprArr);
  
  // 1-1. fix incorrect syntax
  exprArr = fixSyntax(exprArr);
  
  // if exprArr is empty, after correcting expression
  if (exprArr.length === 0) {
    return [];
  }
  
  // 1-2. change sqrt to power
  exprArr = sqrt2power(exprArr);
  
  // 2-1. find hidden multiply
  exprArr = findHiddenMultiply(exprArr);
  
  // 2-2. add parentheses for order
  // log ln > √ ^ > * / % > + -
  exprArr = makeOrder(exprArr);
  
  let openIndexArr = [];
  let closeIndexArr = [];
  let startNest = false;
  let endNest = false;
  
  while (true) {
    console.log("Calculating: ", convert2String(exprArr));
    
    // 3. find all open close parentheses
    openIndexArr = findAllIndexes(exprArr, "op-open");
    closeIndexArr = findAllIndexes(exprArr, "op-close");
    
    // 4. find nest parentheses
    [startNest, endNest] = findNest(exprArr, openIndexArr, closeIndexArr);
    
    // if there is nested parentheses
    if (typeof startNest === 'number') {
      // 5. calculate the part
      answer = partCalculate(exprArr.slice(startNest + 1, endNest));
      
      // 6. replace exprArr
      [exprArr, openIndexArr, closeIndexArr] = replaceArr(exprArr, openIndexArr, closeIndexArr, startNest, endNest, answer);
    }
    else {
      answer = partCalculate(exprArr);
      break;
    }
  }
  
  // change calcularting operator to normal operator
  answer = answer.map(item => {
    if (symbol[item][1] === "x") {
      return symbol[item][2];
    }
    return item;
  });
  
  return answer;
};

// calculate 2-2
const makeOrder = (arr) => {
  
  // 2-2-1. log ln
  arr = addParentheses(arr, ["op-log", "op-ln"], []);
  
  // 2-2-2. power
  arr = addParentheses(arr, ["op-power"], [3, 4, 5]);
  
  // 2-2-3. */%
  arr = addParentheses(arr, ["op-multiple", "op-divide", "op-mod"], [3, 4, 5]);
  
  /// 2-2-4. +-
  arr = addParentheses(arr, ["op-plus", "op-minus"], [3, 4, 5]);
  
  return arr;
};

// 2-2 module
const addParentheses = (arr, opArr, stopPointArr) => {
  let back;
  let front;
  
  for (let i = 0; i < arr.length; i++) {
    if (opArr.includes(arr[i])) {
      back = findClosest(arr, i, stopPointArr, 1);
      
      if (opArr.includes("op-log") || opArr.includes("op-ln")) {
        front = i - 1;
      }
      else {
        front = findClosest(arr, i, stopPointArr, -1);
      }
      
      arr.splice(back, 0, "op-close");
      arr.splice(front + 1, 0, "op-open");
      i++;
      console.log("Wrapping: ", convert2String(arr));
    }
  }
  return arr;
};

// order = -1 front, 1 back
const findClosest = (arr, pivot, stopPointArr, direction) => {
  let i = -1;
  let start;
  let end;
  let step;
  let open;
  let close;
  
  if (direction === 1) {
    start = pivot + 1;
    end = arr.length - 1;
    step = 1;
    open = "op-open";
    close = "op-close";
  }
  else {
    start = pivot - 1;
    end = 0;
    step = -1;
    open = "op-close";
    close = "op-open";
  }
  
  let openCount = 0;
  
  for (; start * step < end; start += step) {
    if (arr[start] == open) {
      openCount++;
      continue;
    }
    else if (arr[start] == close) {
      if (openCount > 0) {
        openCount--;
        continue;
      }
      else {
        i = start;
        break;
      }
    }
    else if (stopPointArr.includes(symbol[arr[start]][1]) && openCount === 0) {
      i = start;
      break;
    }
  }
  
  // if there no match
  if (i === -1 && direction === 1) {
    i = arr.length;
  }
  
  return i;
}

// calculate 2-1
const findHiddenMultiply = (arr) => {
  let modified = false;
  
  for (let i = 0; i < arr.length - 1; i++) {
    let checkSum = symbol[arr[i]][1] * 10 + symbol[arr[i + 1]][1];
    
    if (hiddenMultiplyList.includes(checkSum)) {
      arr.splice(i + 1, 0, "op-multiple");
      i++;
      modified = true;
    }
  }
  
  if (modified) {
    console.log("Add hidden multiply: ", convert2String(arr));
  }
  
  return arr;
};

// calculate 2
const iterFind = (arr, findArr, add, additionalFunc) => {
  for (let i = 0; i < arr.length - 1; i++) {
    let check = symbol[arr[i]][1] * 10 + symbol[arr[i + 1]][1];
    
    if (findArr.includes(check)) {
      arr.splice(i + 1, 0, add);
      if (typeof additionalFunc === "function") {
        additionalFunc();
      }
      i++;
    }
  }
  return arr;
};

// calculate 6
const replaceArr = (arr, open, close, start, end, ans) => {
  
  arr.splice(start, end - start + 1, ...ans);
  
  open = open.filter(item => item !== start);
  close = close.filter(item => item !== end);
  
  return [arr, open, close];
};

// calculate 4
const findNest = (arr, openIndexArr, closeIndexArr) => {
  if (openIndexArr.length === 0) {
    return [false, false];
  }
  
  let firstClose = closeIndexArr[0];
  
  let previousOpen = openIndexArr.filter(item => item < firstClose);
  let lastOpen = previousOpen[previousOpen.length - 1];
  
  return [lastOpen, firstClose];
};

// calculate 3
const findAllIndexes = (arr, value) => {
  const indexes = [];
  arr.forEach((item, index) => {
    if (item === value) {
      indexes.push(index);
    }
  });
  return indexes;
};

// calculate 2
const convert2String = (arr) => {
  return arr.map(item => symbol[item][0]).join('');
};

const convert2Symbol = (str) => {
  // change log -> g, ln -> n
  let changeLogStr = str.replace(/ln/g, 'n').replace(/log/g, 'g');
  let strArr = changeLogStr.split("");
  strArr = strArr.map(word => {
    if (word === 'n') {
      return 'ln';
    } else if (word === 'g') {
      return 'log';
    }
    return word;
  });
  
  const converted = [];
  strArr.forEach(item => {
    for (const [symbolKey, symbolVal] of Object.entries(symbol)) {
      if (symbolVal[0] === item) {
        converted.push(symbolKey);
      }
    }
  });
  return converted;
};

// calculate 1-2
const sqrt2power = (arr) => {
  let modified = false;
  
  
  let i = arr.indexOf("op-root");
  let count = 0;
  while (i >= 0) {
    
    count = 0;
    if (arr[i + 1] === "op-open") {
      // find parentheses
      for (let j = i; j < arr.length; j++) {
        
        if (arr[j] === "op-open") {
          count++;
          
        } else if (arr[j] === "op-close") {
          
          if (count > 1) {
            count--;
          } else {
            
            // remove sqrt and add ^0.5
            arr.splice(j + 1, 0, "op-power", "num-zero", "num-dot", "num-five");
            arr.splice(i, 1);
            modified = true;
            break;
          }
        }
      }
    } else {
      console.log("Sqrt does not have open parentheses");
      return ["error-syntax"];
    }
    
    i = arr.indexOf("op-root");
  }
  if (modified) {
    console.log("sqrt to power: ", convert2String(arr));
  }
  return arr;
};

// calculate 1
const countParentheses = (exprArr) => {
  let countOpen = exprArr.filter(item => item === "op-open").length;
  let countClose = exprArr.filter(item => item === "op-close").length;
  let countDiff = countOpen - countClose;
  
  if (countDiff !== 0) {
    console.log("parentheses: open - close = ", countDiff);
    
    if (countDiff > 0) {
      for (let i = 0; i < countDiff; i++) {
        exprArr.push("op-close");
      }
      console.log("Add close parentheses");
    }
    else if (countDiff < 0) {
      for (let i = 0; i > countDiff; i--) {
        exprArr.unshift("op-open");
      }
      console.log("Add open parentheses");
    }
  }
  
  return exprArr;
};

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