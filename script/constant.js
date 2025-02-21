/* symbol["..."][1]: is it valid new key append after last key, else replace last key
Digit code: 
  symbol: 
    previous key can be : hidden multiply
  _: can starts with
0: 1: 1 . + - log ( _ : pi )
1: pi: + - log ( _ : 1 pi )
2: .: 1 _ :
3: +: 1 pi ) :
4: -: 1 pi log ( ) _ :
5: log √: + - log ( _ : 1 pi )
6: (: + - log ( _ : 1 pi )
7: ): 1 pi ( ) : 
8: combination
9: equal, space, error
*/
const symbol = {
  "num-one": ["1", 0],
  "num-two": ["2", 0],
  "num-three": ["3", 0],
  "num-four": ["4", 0],
  "num-five": ["5", 0],
  "num-six": ["6", 0],
  "num-seven": ["7", 0],
  "num-eight": ["8", 0],
  "num-nine": ["9", 0],
  "num-zero": ["0", 0],
  "num-thousand": ["000", 8],
  "num-dot": [".", 2],
  "num-pi": ["π", 1],
  "num-e": ["e", 1],
  "num-i": ["i", 1],
  "op-parentheses": ["()", 8],
  "op-open": ["(", 6],
  "op-close": [")", 7],
  "op-log": ["log", 5],
  "op-ln": ["ln", 5],
  "op-plus": ["+", 3],
  "op-minus": ["-", 4],
  "op-multiple": ["*", 3],
  "op-divide": ["/", 3],
  "op-power": ["^", 3],
  "op-mod": ["%", 3],
  "op-root": ["√", 5],
  "equal": ["=", 9],
  "space": ["_", 9],
  "cal-plus": ["p", "x", "op-plus"],
  "cal-minus": ["m", "x", "op-minus"],
  "cal-divide": ["d", "x", "op-divide"],
  "cal-multiple": ["t", "x", "op-multiple"],
  "cal-power": ["x", "x", "op-power"],
  "cal-open": ["o", "x", "op-open"],
  "cal-close": ["c", "x", "op-close"],
  "cal-log": ["g", "x", "op-log"],
  "cal-ln": ["n", "x", "op-ln"],
  "error-NaN": ["Not a number", 9],
  "error-zero": ["Zero division error", 9],
  "error-over": ["Overflow", 9],
  "error-under": ["Underflow", 9],
  "error-syntax": ["Syntax error", 9],
  "error-log": ["Log undefined", 9],
  "error": ["Error", 9],
};
// thousand -> zero zero zero
// parentheses -> open close

// result init
const resultBox = document.getElementById("result");

// first digit: before key
// second digit: after key
// const validList = [0, 2, 3, 4, 7, 13, 14, 17, 20, 30, 31, 35, 36, 40, 41, 45, 46, 50, 51, 54, 55, 56, 60, 61, 64, 65, 66, 67, 73, 74, 77];
const hiddenMultiplyList = [5, 6, 15, 16, 70, 71, 75, 76];
// const hiddenMultiplyList = [1, 5, 6, 10, 11, 15, 16, 70, 71, 75, 76];
const validList = [0, 2, 3, 4, 7, 13, 14, 17, 20, 30, 31, 35, 36, 40, 41, 45, 46, 50, 51, 54, 55, 56, 60, 61, 64, 65, 66, 67, 73, 74, 77, 1, 5, 6, 10, 11, 15, 16, 70, 71, 75, 76];
const replaceList = [23, 24, 25, 26, 27, 33, 34, 37, 43, 44, 47]; // 09 -> 9, (+ -> (