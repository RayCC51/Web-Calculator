
// FIXME: 1e-7 -> underflow
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
  
  // split number and operatir
  
  
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
      
      
      // ^
      if (op[0] === "op-power") {
        // power with positive
        
        
        if (head[0] !== "cal-minus" && head[0] !== "op-minus") {
          
          // let headNum = Number(convert2String(head));
          // let tailNum = Number(convert2String(tail));
          // answer = convert2Symbol(truncate(Math.pow(headNum, tailNum)).toString());
          let powResult = Math.pow(headNum, tailNum);
          
          // do not calculate big number 10^21 ≤
          if (powResult === Infinity || powResult.toString().includes("e+")) {
            return ["error-over"];
          }
          else {
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
          let complex = ["num-e", "cal-power", "cal-open", "num-i", "cal-multiple", "num-pi", "cal-multiple", ...tail];
          // answer = [...convert2Symbol(truncate(Math.pow(headNum, tailNum)).toString()), "op-multiple", ...complex];
          answer = [...calculateAnswer(Math.pow(headNumPositive, tailNum)), "op-multiple", ...complex];
          
        }
      }
      // % / 
      else if (op[0] === "op-mod" || op[0] === "op-divide") {
        
        if (tail.length === 1 && tail[0] === "num-zero")
        {
          // zero division / mod error
          return ["error-zero"];
        }
        else {
          // let headNum = Number(convert2String(head));
          // let tailNum = Number(convert2String(tail));
          
          // divide
          if (op[0] === "op-divide") {
            answer = calculateAnswer(headNum / tailNum);
          }
          // mod
          else {
            answer = calculateAnswer(headNum % tailNum);
          }
          
        }
        
      }
      // +*  -
      else {
        if (op[0] === "op-multiple") {
          answer = calculateAnswer(headNum * tailNum);
        }
        else if (op[0] === "op-plus") {
          answer = calculateAnswer(headNum + tailNum);
        }
        else if (op[0] === "op-minus") {
          answer = calculateAnswer(headNum - tailNum);
        }
        else {
          console.log("Invaild operator: ", op[0]);
          return ["error"];
        }
      }
      
    }
    else {
      // TO DO: polynomial +-* /^%
      
      // 1+1, 1+pi, 1*pi, log1
      // TO DO: calculate cal-...
    }
  }
  else {
    return ["error-syntax"];
  }
  
  // TODO: need error handling
  // TO DO: need handle calculate symbol
  
  if (answer[0] === "op-minus") {
    answer[0] = "cal-minus";
  }
  
  
  
  
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