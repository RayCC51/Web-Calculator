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