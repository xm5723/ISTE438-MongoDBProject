// resets the page
function reset() {
    window.location.reload();
  }
// code to execute when we search for the keyword
function nextFields(){
    var searchText = document.getElementById('toSearch').value;
    var selectFrom = document.createElement("h2");
    selectFrom.innerHTML = "Select from the below list for a precise result";
    var temp = 0;
    if(temp == 0){
        document.getElementsByTagName('form')[0].appendChild(selectFrom);
        temp++;
    }
    // let arr be the array of the returned array of the field values for the text
    var arr = [];
    var select = document.createElement("select");
    // select List code
    for(var i=0; i<arr.length; i++){
        var option = document.createElement("option");
        option.setAttribute("value", arr[i]);
        option.appendChild(document.createTextNode(arr[i]));
        select.appendChild(option);
    }
    document.getElementsByTagName('form')[0].appendChild(select);
}  