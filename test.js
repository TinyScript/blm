function combine(arr) {
  var r = [];
  (function f(t, a, n) {
    if (n == 0) return r.push(t);
    for (var i = 0; i < a[n-1].length; i++) {
      f(t.concat(a[n-1][i]), a, n - 1);
    }
  })([], arr, arr.length);
  return r;
}
var arr = [
  ["黑色","白色"],
  ["12码","13码","14码"] ,
];

arr.reverse();
var res = combine(arr);
var row = [];
var rowspan = res.length;
for(var n=arr.length-1; n>-1; n--) {

  row[n] = parseInt(rowspan/arr[n].length);
  rowspan = row[n];
}
console.log(arr)
row.reverse();
var str = "";
var len = res[0].length;
for (var i=0; i<res.length; i++) {
  var tmp = "";
  for(var j=0; j<len; j++) {
    if(i%row[j]==0 && row[j]>1) {
      tmp += "<td rowspan='"+ row[j] +"'>"+res[i][j]+"</td>";
    }else if(row[j]==1){
      tmp += "<td>"+res[i][j]+"</td>";
    }
  }
  str += "<tr>" + tmp + "<td>xxx</td>" + "<td>xxx</td>" + "</tr>";
}
// console.log(row);
// console.log(res);
