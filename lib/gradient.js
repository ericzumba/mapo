function maxDigit(base) {
  return base - 1
}

function grad(row, step, base) {
  var hex = function(x) {
      return x.toString(base);
  };

  var r = digit(row, 0, base, step) 
  var g = digit(row, 1, base, step) 
  var b = digit(row, 2, base, step) 

  return [r, g, b]
}

function digit(row, col, base) { 
  if(col == 0)
    return Math.max(0, maxDigit(base) - row)
  else if (col == 1)
    if (row <= maxDigit(base))
      return row 
    else
      return Math.max(0, maxDigit(base) - (row - maxDigit(base)))
  else
    if (row <= maxDigit(base))
      return 0 
    else
      return Math.min(maxDigit(base), maxDigit(base) - digit(row, col -1, base))
}
