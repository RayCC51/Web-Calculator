const symbol = {
  "num-one": ["1", ],
  "num-two": ["2", ],
  "num-three": ["3", ],
  "num-four": ["4", ],
  "num-five": ["5", ],
  "num-six": ["6", ],
  "num-seven": ["7", ],
  "num-eight": ["8", ],
  "num-nine": ["9", ],
  "num-zero": ["0", ],
  "num-thousand": ["000", ],
  "num-dot": [".", ],
  "num-pi": ["π", ],
  "num-e": ["e", ],
  "op-parentheses": ["()", ],
  "op-log": ["log", ],
  "op-plus": ["+", ],
  "op-minus": ["-", ],
  "op-multiple": ["*", ],
  "op-divide": ["/", ],
  "op-power": ["^", ],
  "op-mod": ["%", ],
  "equal": ["=", ],
};
// thousand -> zero zero zero
// parentheses -> open close

// result
const resultBox = document.getElementById("result");
let resultArr = [];

// change result value
const changeResultValue = (item) => {
  let newKey = item.id;
  if (true) {
    resultArr.push(newKey);
  } else{
    resultArr.pop();
    resultArr.push(newKey);
  }
  setResultValue();
};

// true will append new key, false will replace last key
const isNewKeyValid = (key) => {
}

// set result list to string
const setResultValue = () => {
  resultBox.textContent = resultArr.join('');
}


// on button click
const allBtn = document.querySelectorAll(".btn");

allBtn.forEach(item => {
  if (item.classList.contains("cursor")) {
    item.onclick = () => console.log(item.id);
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
    let original = item.textContent;
    
    const textarea = document.createElement('textarea');
    textarea.value = original;
    document.body.appendChild(textarea); 
    textarea.select(); 
    document.execCommand('copy');
    document.body.removeChild(textarea);

    item.textContent = "Copy!";
    setTimeout(() => {
        item.textContent = original;
    }, 700);
}