// parsing and calculating
const calculate = (exprArr) => {
  let answer = ["error"];
  
  // 0. fix incorrect syntax
  exprArr = fixSyntax(exprArr);
  
  // 1. count parentheses and open or close
  exprArr = countParentheses(exprArr);
  
  // 1-2. change sqrt to power
  exprArr = sqrt2power(exprArr);
  
  // 2-1. find hidden multiply and and multiply - except pi e i
  exprArr = findHiddenMultiply(exprArr);
  // exprArr = iterFind(exprArr, hiddenMultiplyList, "op-multiple");
  
  // 2-2. add parentheses for order
  // log ln > √ ^ > * / % > + -
  exprArr = makeOrder(exprArr);
  
  let openIndexArr = [];
  let closeIndexArr = [];
  let startNest = false;
  let endNest = false;
  
  while (true) {
    // for (let i = 0; i < 2; i++){
    console.log("calculating: ", convert2String(exprArr));
    
    // 3. find all open close parentheses
    openIndexArr = findAllIndexes(exprArr, "op-open");
    closeIndexArr = findAllIndexes(exprArr, "op-close");
    // console.log(openIndexArr);
    // console.log(closeIndexArr);
    
    // 4. find nest parentheses
    [startNest, endNest] = findNest(exprArr, openIndexArr, closeIndexArr);
    
    // console.log("startNest: ", startNest);
    if (typeof startNest === 'number') {
      // 5. calculate the part
      answer = partCalculate(exprArr.slice(startNest + 1, endNest));
      
      // 6. replace exprArr
      [exprArr, openIndexArr, closeIndexArr] = replaceArr(exprArr, openIndexArr, closeIndexArr, startNest, endNest, answer);
      
      // console.log("calculate nest");
      // console.log("calculating: ", convert2String(exprArr));
    }
    else {
      answer = partCalculate(exprArr);
      
      // console.log("last calculate");
      break;
    }
  }
  
  return answer;
};

// calculate 0
const fixSyntax = (arr) => {
  // console.log("fixing syntax...");
  // 1. fix dot without num
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "num-dot") {
      if (i === 0) {
        console.log("fix syntax: dot")
        arr.unshift("num-zero");
        i++;
        continue;
      }
      // dot without int
      if (symbol[arr[i - 1]][1] !== 0) {
        console.log("fix syntax: dot")
        arr.splice(i, 0, "num-zero");
        i++;
        continue;
      }
      // dot without float
      if (i === arr.length - 1) {
        arr.push("num-zero");
      }
      if (symbol[arr[i + 1]][1] !== 0) {
        arr.splice(i + 1, 0, "num-zero");
      }
    }
  }
  // 2. remove empty ()
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "op-open") {
      if (i === arr.length - 1) {
        arr.pop();
        continue;
      }
      else if (arr[i + 1] === "op-close") {
        // remove log() ln() sqrt()
        if (i !== 0 && symbol[arr[i - 1]][1] === 5) {
          arr.splice(i - 1, 3);
          i -= 3;
        }
        // 1()2 →⁠ 1*2
        else if (i > 0 &&
          i < arr.length - 2 && [0, 1].includes(symbol[arr[i - 1]][1]) && [0, 1].includes(symbol[arr[i + 2]][1])
        ) {
          arr.splice(i, 2, "op-multiple");
          i -= 2;
        }
        else {
          arr.splice(i, 2);
          i -= 2;
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
        continue;
      }
      else if (i === arr.length - 1) {
        arr.pop()
        continue;
      }
      if (arr[i - 1] === "op-open") {
        if (arr[i] === "op-minus") {
          continue;
        }
        arr.splice(i, 1);
      }
      if (arr[i + 1] === "op-close") {
        arr.splice(i, 1);
      }
    }
  }
  
  
  console.log("fixing complete: ", convert2String(arr));
  return arr;
};

// calculate 2-2
const makeOrder = (arr) => {
  // arr.unshift("op-open");
  // arr.push("op-close");
  
  // 2-2-1. find log ln sqrt and wrap
  // arr = iterFind(arr, [5,15,25,35,45,75], "op-open", autoClose);
  for (let i = 0; i < arr.length - 1; i++) {
    let check = symbol[arr[i]][1] * 10 + symbol[arr[i + 1]][1];
    
    if (i === 0 && Math.floor(check / 10) === 5) {
      arr.unshift("op-open");
      let firstClose = arr.indexOf("op-close");
      arr.splice(firstClose, 0, "op-close");
      i++;
      console.log(convert2String(arr));
    }
    
    else if ([5, 15, 25, 35, 45, 75].includes(check)) {
      arr.splice(i + 1, 0, "op-open");
      // close after log
      let afterFind = arr.slice(i);
      let firstClose = afterFind.indexOf("op-close");
      arr.splice(i + firstClose, 0, "op-close");
      i++;
      console.log(convert2String(arr));
    }
  }
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
  for (let i = 0; i < arr.length; i++) {
    if (opArr.includes(arr[i])) {
      let back = findClosest(arr, i, stopPointArr, 1);
      let front = findClosest(arr, i, stopPointArr, -1);
      
      if (front === 0) {
        front = -1;
      }
      
      // console.log("find", arr[i], ": ", i, front, back);
      
      arr.splice(back, 0, "op-close");
      arr.splice(front + 1, 0, "op-open");
      i++;
      console.log(convert2String(arr));
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
  
  // console.log("find close: ", pivot, direction);
  
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
  if (i === -1) {
    if (direction === 1) {
      i = arr.length;
    }
    else {
      i = 0;
    }
  }
  
  return i;
}

// calculate 2-1
const findHiddenMultiply = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    let check = symbol[arr[i]][1] * 10 + symbol[arr[i + 1]][1];
    
    if (hiddenMultiplyList.includes(check)) {
      arr.splice(i + 1, 0, "op-multiple");
      i++;
    }
  }
  // console.log("add *: ", arr);
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
  // console.log(arr, open,close, start, end, ans);
  
  arr.splice(start, end - start + 1, ...ans);
  
  open = open.filter(item => item !== start);
  close = close.filter(item => item !== end);
  
  // console.log(arr, open, close, start, end, ans);
  
  return [arr, open, close];
};

// calculate 5
const partCalculate = (arr) => {
  // if arr has error
  let error = arr.filter(item => symbol[item][1] === 9);
  if (error.length > 0) {
    return error;
  }
  
  console.log(convert2String(arr), " = ");
  let answer = ["num-pi"];
  
  let head = [];
  let op = [];
  let tail = [];
  let isBeforeOp = true;
  // seperate operator
  for (let i = 0; i < arr.length; i++) {
    if (symbol[arr[i]][1] === 0 || symbol[arr[i]][1] === 1) {
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
  // console.log(head);
  // console.log(op);
  // console.log(tail);
  if (op.length > 1) {
    console.log("ERROR: 2 operator in 1 parentheses");
    return ["error"];
  }
  // FIXME: (1+pi)*(1*pi)
  
  // TODO
  // 1+1, 1+pi, 1*pi, log1
  // log: no head
  if (["op-log", "op-ln", "op-root"].includes(...op)) {
    if (head.length !== 0) {
      console.log("ERROR: something is in front of log ln root");
      return ["error"];
    }
    // TODO: calculate log ln root
  }
  
  // TODO: arr has only nunber, not op tail
  // TODO: need error handling
  return answer;
};

// arrange number and pi e i
// do not convert pi e i to number
// FIXME: 1+pi
const onePi = (arr) => {
  // find pi e i
  let piei = [];
  for (let i = 0; i < arr.length; i++) {
    if (["num-pi", "num-e", "num-i"].includes(arr[i])) {
      piei.push(arr[i]);
      arr.splice(i, 1, "op-multiple");
    }
  }
  let numbers = convert2String(arr).split("*");
  try {
    let product = numbers.map(Number).reduce((acc, curr) => acc * curr, 1);
    if (!isFinite(product)) {
      throw new Error("overflow or underflow");
    }
    // TODO: use convert2Symbol, sort piei, append piei
  }
  catch (e) {
    console.log("ERROR: ", e);
    return ["error-over"];
  }
  return arr;
};

// calculate 4
const findNest = (arr, openIndexArr, closeIndexArr) => {
  if (openIndexArr.length === 0) {
    return [false, false];
  }
  
  let firstClose = closeIndexArr[0];
  
  let previousOpen = openIndexArr.filter(item => item < firstClose);
  let lastOpen = previousOpen[previousOpen.length - 1];
  
  // console.log(convert2String(arr));
  // console.log(previousOpen);
  // console.log(lastOpen, firstClose);
  
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
  const strArr = str.split("");
  
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
  // console.log("start sqrt2power");
  let i = arr.indexOf("op-root");
  let count = 0;
  while (i > 0) {
    console.log("sqrt index: ", i);
    count = 0;
    // TODO sqrt is not changed
    if (arr[i + 1] === "op-open") {
      // find parentheses
      for (let j = i; j < arr.length; j++) {
        console.log(j, arr[j]);
        if (arr[j] === "op-open") {
          count++;
          console.log("find open, ", count);
        } else if (arr[j] === "op-close") {
          
          if (count > 1) {
            count--;
          } else {
            console.log("replace sqrt to power");
            // remove sqrt and add ^0.5
            arr.splice(j + 1, 0, "op-power", "num-zero", "num-dot", "num-five");
            arr.splice(i, 1);
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
  // console.log("sqrt to power: ", convert2String(arr));
  return arr;
};

// calculate 1
const countParentheses = (exprArr) => {
  let countOpen = exprArr.filter(item => item === "op-open").length;
  let countClose = exprArr.filter(item => item === "op-close").length;
  let countDiff = countOpen - countClose;
  console.log("parentheses: open - close = ", countDiff);
  
  if (countDiff > 0) {
    for (let i = 0; i < countDiff; i++) {
      exprArr.push("op-close");
      console.log("+ op-close");
    }
  }
  else if (countDiff < 0) {
    for (let i = 0; i > countDiff; i--) {
      exprArr.unshift("op-open");
      console.log("+ op-open");
    }
  }
  
  return exprArr;
};

// prevent 1.1.1 and 000
const isZeroDotValid = (newKey) => {
  // console.log(newKey);
  let numSet = findNumberSet(resultArr);
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