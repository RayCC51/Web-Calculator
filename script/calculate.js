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
  let modified = false;
  
  // console.log("fixing syntax...");
  // 1. fix dot without num
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "num-dot") {
      if (i === 0) {
        console.log("fix syntax: dot")
        arr.unshift("num-zero");
        i++;
        modified = true;
        continue;
      }
      // dot without int
      if (symbol[arr[i - 1]][1] !== 0) {
        console.log("fix syntax: dot")
        arr.splice(i, 0, "num-zero");
        i++;
        modified = true;
        continue;
      }
      // dot without float
      if (i === arr.length - 1) {
        arr.push("num-zero");
        modified = true;
      }
      if (symbol[arr[i + 1]][1] !== 0) {
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
        continue;
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
        continue;
      }
      else if (i === arr.length - 1) {
        arr.pop();
        modified = true;
        continue;
      }
      if (arr[i - 1] === "op-open") {
        if (arr[i] === "op-minus") {
          continue;
        }
        arr.splice(i, 1);
        modified = true;
      }
      if (arr[i + 1] === "op-close") {
        arr.splice(i, 1);
        modified = true;
      }
    }
  }
  
  if (modified){
  console.log("syntax fixed: ", convert2String(arr));
  }
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
  const error = arr.filter(item => symbol[item][1] === 9);
  if (error.length > 0) {
    return error;
  }
  
  let answer = ["num-i"];
  // let answer = ["cal-open", "num-pi", "cal-close"];
  
  // pi -> Math.PI, e -> Math.E
  arr = arr.flatMap((item) => {
    if (item === "num-pi"){
      return calculateAnswer(Math.PI);
    }
    else if (item === "num-e"){
      return calculateAnswer(Math.E);
    }
    else{
      return [item];
    }
  })
  
  // split number and operatir
  // const str = convert2String(arr);
  
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
  
  // console.log(head, op, tail);
  
  // operator length should be 1 or 0
  if (op.length > 1) {
    console.log("ERROR: 2 operator in 1 parentheses");
    return ["error-syntax"];
  }
  else if(head[0] === "cal-minus"){
    head[0] = "op-minus";
  }
  else if(tail[0] === "cal-minus"){
    tail[0] = "op-minus";
  }
  
  if (head.length !== 0 && op.length === 0 && tail.length === 0) {
    // no op, tail: just number or 1+pi or 1pi
    answer = head;
  } else if (head.length === 0) {
    // no head: log ln -1
    if (op[0] === "op-minus") {
      answer = ["cal-minus", ...tail];
    }
    else if (op[0] === "op-log") {
      if (isPolynomial(tail)) {
        answer = ["cal-log", ...tail];
      }
      else {
        let num = Number(convert2String(tail));
        if (num === NaN) {
          return ["error-NaN"];
        }
        else if (num <= 0) {
          return ["error-log"];
        }
        else {
          answer = convert2Symbol(truncate(Math.log10(num)).toString());
        }
      }
    }
    else if (op[0] === "op-ln") {
      if (isPolynomial(tail)) {
        answer = ["cal-ln", ...tail];
      }
      else {
        let num = Number(convert2String(tail));
        if (num === NaN) {
          return ["error-NaN"];
        }
        else if (num <= 0) {
          return ["error-log"];
        }
        else {
          answer = convert2Symbol(truncate(Math.log(num)).toString());
        }
      }
    }
    else {
      console.log("No head with op: ", op[0]);
      return ["error-syntax"];
    }
  }
  else if (head.length !== 0 && op.length !== 0 && tail.length !== 0) {
    // + - * / ^ %
    let headNum = Number(convert2String(head));
let tailNum = Number(convert2String(tail));
    
    // easy way. without pi e i
    if (!isPolynomial(head) && !isPolynomial(tail)) {
      // console.log("It does not contain e π i");
  
      // ^
      if (op[0] === "op-power") {
        // power with positive
        // console.log("calculate power");
        // console.log(head, op, tail);
        if (head[0] !== "cal-minus" && head[0] !== "op-minus") {
          // console.log("^^^");
          // let headNum = Number(convert2String(head));
          // let tailNum = Number(convert2String(tail));
          // answer = convert2Symbol(truncate(Math.pow(headNum, tailNum)).toString());
          let powResult = Math.pow(headNum, tailNum);
          
          // do not calculate big number 10^21 ≤
          if(powResult === Infinity || powResult.toString().includes("e+")){
            return ["error-over"];
          }
          else{
          answer = calculateAnswer(powResult);
          }
        }
        else {
          // do not calculate complex number
          return ["error-complex"];
          
          // power with negative
          // let headNum = Number(convert2String(head.slice(1)));
          let headNumPositive = headNum.slice(1);
          // let tailNum = Number(convert2String(tail));
          // i^tail = e^iπtail
          let complex = ["num-e", "cal-power", "cal-open", "num-i", "cal-multiple", "num-pi", "cal-multiple", ...tail ];
          // answer = [...convert2Symbol(truncate(Math.pow(headNum, tailNum)).toString()), "op-multiple", ...complex];
          answer = [...calculateAnswer(Math.pow(headNumPositive, tailNum)), "op-multiple", ...complex];
          
        }
      }
      // % / 
      else if (op[0] === "op-mod" || op[0] === "op-divide") {

        if(tail.length === 1 && tail[0] === "num-zero")
        {
          // zero division / mod error
          return ["error-zero"];
        }
        else{
          // let headNum = Number(convert2String(head));
          // let tailNum = Number(convert2String(tail));
        
          // divide
          if (op[0] === "op-divide"){
            answer = calculateAnswer(headNum/tailNum);
          }
          // mod
          else{
            answer = calculateAnswer(headNum%tailNum);
          }
          
        }
        
      }
      // +*  -
      else {
        if(op[0] === "op-multiple"){
          answer = calculateAnswer(headNum*tailNum);
        }
        else if(op[0] === "op-plus"){
          answer = calculateAnswer(headNum+tailNum);
        }
        else if(op[0] === "op-minus"){
          answer = calculateAnswer(headNum-tailNum);
        }
        else {
          console.log("Invaild operator: ", op[0]);
          return ["error"];
        }
      }
      
    }
    else {
      // TO DO: polynomial +-* /^%
      // console.log("It contain eπi");
      // 1+1, 1+pi, 1*pi, log1
      // TO DO: calculate cal-...
    }
  }
  else {
    return ["error-syntax"];
  }

  // TODO: need error handling
  // TO DO: need handle calculate symbol
  
  if(answer[0] === "op-minus"){
    answer[0] = "cal-minus";
  }
  
  // console.log(convert2String(arr), " = ", convert2String(answer));
  // console.log("answer is polynomial: ", isPolynomial(answer));
  
  return answer;
};

// 
const calculateAnswer = (num) => {
  return convert2Symbol(truncate(num).toString());
}

// round after 10 decimal places
const truncate = (num) => {
  return Math.round(num * 1e10) / 1e10;
}

// find 1+pi, 1pi...
const isPolynomial = (arr) => {
  
  if (arr.filter(item => symbol[item][1] === 1).length === 0) {
    return false;
  }
  return true;
  
  // return false;
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
  
  // console.log("start sqrt2power");
  let i = arr.indexOf("op-root");
  let count = 0;
  while (i >= 0) {
    // console.log("sqrt index: ", i);
    count = 0;
    if (arr[i + 1] === "op-open") {
      // find parentheses
      for (let j = i; j < arr.length; j++) {
        // console.log(j, arr[j]);
        if (arr[j] === "op-open") {
          count++;
          // console.log("find open, ", count);
        } else if (arr[j] === "op-close") {
          
          if (count > 1) {
            count--;
          } else {
            // console.log("replace sqrt to power");
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
  if(modified){
  console.log("sqrt to power: ", convert2String(arr));
  }
  return arr;
};

// calculate 1
const countParentheses = (exprArr) => {
  let countOpen = exprArr.filter(item => item === "op-open").length;
  let countClose = exprArr.filter(item => item === "op-close").length;
  let countDiff = countOpen - countClose;
  if(countDiff !== 0){
  console.log("parentheses: open - close = ", countDiff);
  }
  
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