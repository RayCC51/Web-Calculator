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