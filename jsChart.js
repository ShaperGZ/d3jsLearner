class TableSpanInput{
    constructor(parent){
        this.parent=parent;
        this.table=document.createElement("table");
        this.tb=document.createElement("tb");
        this.table.appendChild(this.tb);
        this.parent.appendChild(this.table);
        this.classContent="content";
        this.textSizeContent=8;
        this.rows=[]
    }
    
    addRow(rowObj){
        console.log("add row d:"+rowObj.name+","+rowObj.value);
        var d=rowObj;
        var name=d.name;
        var value=d.value
        var span=document.createElement("span")
        span.innerHTML=name

        var input=document.createElement("input")
        input.type="text"
        input.class=this.classContent
        input.value=value
        input.width=50
        input.id="tb_"+name;
        self=this;
        input.onkeydown=function(key){
            if (key.keyCode == "13"){
                value=input.value;
                self.onValueChange(name,value);
            }
        }
        var tr=document.createElement("tr");

        this.addCell(span,tr);
        this.addCell(input,tr);

        this.tb.appendChild(tr);
        this.rows.push(tr);
    }

    addCell(domObj,row){
        var td=document.createElement("td");
        td.appendChild(domObj);
        row.appendChild(td);
    }

    onValueChange(name,value){
        var txt="onValueChanged name:"+name+" value:"+value;
        console.log(txt);
    }
}


data=[
    {"name":"bd_ftfh", "value":"6,3"},
    {"name":"un_width","value":"3"},
    {"name":"un_depth","value":"9"},
]

body=document.getElementsByTagName("body")[0]
tableBB= new TableSpanInput(body);

data.forEach(function(d){
    var name=d.name;
    var value=d.value
    tableBB.addRow(d);
})

