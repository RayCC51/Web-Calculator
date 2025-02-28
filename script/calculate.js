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