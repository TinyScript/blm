var p =[
  ["白"],
  ["12码","13码","14码"],
  ["男","女"],
]


var arr = js(p[0],p[1])
var b = true
var index = 2;
while(b){
  if(p[index]){
    arr = js(arr,p[index])
    index ++;
  }else{
    break;
  }
}
//alert(arr.length)
console.log(arr)


function js(arr1,arr2){
  var arr = Array();
  for(var i=0;i<arr1.length;i++){
    for(var j=0;j<arr2.length;j++){
      arr.push(arr1[i]+" "+arr2[j]);
    }
  }
  return arr;
}
