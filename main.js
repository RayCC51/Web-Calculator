// on button click
const allBtn = document.querySelectorAll(".btn");

allBtn.forEach(item => {
  item.onclick = function() {
    console.log(item.id);
  };
});

// copy result text
const resultText = document.getElementById("result");
resultText.onclick = function() {
  navigator.clipboard.writeText(resultText.textContent)
  .then(() => {
    var resultNum = resultText.textContent;
    resultText.textContent = "Copy!";
    setTimeout(() => {
      resultText.textContent = resultNum;
    }, 1000);
  })
  .catch(err => {
    console.error('Copy Fail:', err);
  });
};