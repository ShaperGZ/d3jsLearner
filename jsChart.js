data=[
    {"name":"bd_ftfh", "value":"6,3"},
    {"name":"un_width","value":"3"},
    {"name":"un_depth","value":"9"},
]

body=document.getElementsByTagName("body")[0]

tableBB=document.createElement("table");
tableBB.tb=document.createElement("tb");

function onValueChange(name,value){
    txt="onValueChanged name:"+name+" value:"+value;
    console.log(txt);
}

data.forEach(function(d){
    var name=d.name;
    var value=d.value
    var span=document.createElement("span")
    span.innerHTML=name

    var input=document.createElement("input")
    input.type="text"
    input.class="content"
    input.value=value
    input.width=50
    input.id="tb_"+name;
    input.onkeydown=function(key){
        if (key.keyCode == "13"){
            value=input.value;
            onValueChange(name,value);
        }
    }
    // input.text(value)

    var tr=document.createElement("tr")
    tableBB.append(tr)
    var td_span=document.createElement("td")
    td_span.append(span)
    var td_input=document.createElement("td")
    td_input.append(input)
    td_span.width=50
    td_input.width=50
    tr.append(td_span)
    tr.append(td_input)

})

body.append(tableBB);
tableBB.append(tableBB.tb);
