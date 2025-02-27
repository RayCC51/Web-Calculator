// calculate 0
const fixSyntax = (arr) => {
  let modified = false;
  
  // 1. fix dot without num
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "num-dot") {
      if (i === 0) {
        console.log("fix syntax: dot")
        arr.unshift("num-zero");
        i++;
        modified = true;
      }
      // dot without int
      else if (symbol[arr[i - 1]][1] !== 0) {
        console.log("fix syntax: dot")
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
    console.log("syntax fixed: ", convert2String(arr));
  }
  return arr;
};