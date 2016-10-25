var exps = {
  2: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ],
  3: [
    [2, 0, 0], 
    [1, 1, 0],
    [0, 2, 0],
    [0, 1, 1],
    [0, 0, 2]
  ],
  4: [
    [3, 0, 0],
    [2, 1, 0],
    [1, 2, 0],
    [0, 3, 0],
    [0, 2, 1],
    [0, 1, 2],
    [0, 0, 3]
  ]
}

for(var base in exps)
  exps[base].forEach((ex, i) => {
    var act = grad(i, 1, base)
    console.log(i + " " + ex + " " + act + " " + (JSON.stringify(act) === JSON.stringify(ex) ? "ok" : "err"))
  })
