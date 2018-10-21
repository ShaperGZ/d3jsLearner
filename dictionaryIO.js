class IOTable{
    constructor(container,data){
        self.data=data;
        //container has to be a d3 object
        self.container=container
        self.tr=self.container.selectAll("tr")
            .data(data)
            .enter()
            .append("tr")

        self.td=self.tr.selectAll('td')
            .data(function(d){return d.data})
            .enter()
            .append('td')
            .text(function(d){return d.value});
        // self.create(data)
    }

    create(data){
        self.tr=self.container.selectAll("tr")
            .data(data)
            .enter()
            .append("tr")

        self.td=self.tr.selectAll('td')
            .data(function(d){return d.data})
            .enter()
            .append('td')
            .text(function(d){return d.value});
    }
}

data=[
    {"name":"bd_ftfh", "value":"6,3"},
    {"name":"un_width","value":"3"},
    {"name":"un_depth","value":"9"},
]

runMe=function(){
    table = d3.select("body").append("table")
    tbody=table.append("tbody")

    iotable=new IOTable(tbody,data);


}
runMe()