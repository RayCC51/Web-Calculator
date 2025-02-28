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