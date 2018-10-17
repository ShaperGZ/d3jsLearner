var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var colorLinear=d3.scale.linear()
    .domain([0,0.5,1])
    .range(["#A63B34","#FFE49B","#5187CB"]);

mydata=[
    {"name":12, "value":0.4, "flag":true},
    {"name":22, "value":0.85, "flag":false},
    {"name":32, "value":0.6, "flag":true},
    {"name":42, "value":0.9, "flag":true},
]

class IDP{
// IDP=function(svg=null, minV=0,maxV=1,data=[]){

    // this.radius=Math.min(this.width,this.height)/2;
    // console.log("i -- svg="+svg);
    // console.log("i -- innerRadius="+innerRadius);
    // console.log("i -- outerRadius="+outerRadius);
    // console.log("i -- data="+data);
    constructor(svg=null, minV=0,maxV=1,data=[]){
        if (svg == null){
            // console.log("Creating svg...");
            this.svg=IDP.create_svg(300,300);
        }
        else{
            // console.log("existing svg:"+svg);
            this.svg=svg;
        }
        // console.log("this.svg="+this.svg);

        this.width= parseInt(this.svg.attr("width"));
        this.height= parseInt(this.svg.attr("height"));
        this.radius=Math.min(this.width,this.height)/2;
        this.minV=minV;
        this.maxV=maxV;

        this.minR=this.minV*this.radius;
        if(maxV!=null)
            this.maxR=this.maxV*this.radius;
        else
            this.maxR=Math.min(this.width,this.height)/2;

        this.data=data;
        this.d_val=function(d){return d.value;};
        this.d_pie_val=function(d){return 1;};
        this.d_name=function(d){return d.name;};
        this.d_label=function(d){return d.data.name;};
        this.d_outerRadius=this.d_outerRadiusCap;
        this.d_innerRadius=this.minR;
        this.d_data_color=function(d){
            var c=colorLinear(d.data.value)
            // console.log("color="+c+ "data.value="+d.data.value);
            return c;
        };
    }//end constructor

    d_outerRadiusCap(d){
        var val=d.data.value;
        console.log("val="+val+ " minV="+this.minV + " maxV="+this.maxV);
        if(val < this.minV){
            return this.minR;
        }
        else if (val > this.maxV){
            return this.maxR;
        }
        return val*this.radius;
    }

    d_text_translate(d){
        var centroid = this.arc.centroid(d);
        // console.log("centroid = "+centroid);
        return "translate("+this.arc.centroid(d)+")";
    }

    create(){
        var data=this.data;
        // 01 define arc generator
        this.arc = d3.svg.arc()
            .outerRadius(this.d_outerRadius)
            .innerRadius(this.d_innerRadius);

        // 02 generate layout
        this.pie = d3.layout.pie()
            .sort(null)
            .value(this.d_pie_val);

        // 03 create graphics inside the svg
        this.graphics=this.svg.append("g")
            .attr("transform","translate("+this.width/2+","+this.height/2+")");

        // binding data
        this.g=this.graphics.selectAll(".arc")
            .data(this.pie(data))
            .enter().append("g")
            .attr("class","arc")

        this.g.append("path")
            .attr("d",this.arc)
            .style("fill", this.d_data_color)
            .style("stroke","white")
            .style("stroke-width",2);

        var self=this;
        // add text labels
        this.g.append("text")
            .attr("transform",function(d){
                var centroid = self.arc.centroid(d);
                // console.log("centroid = "+centroid);
                return "translate("+centroid+")";
            })
            .attr("dy",".35em")
            .style("text_anchor","middle")
            .text(this.d_label);

    };

    invalidate(data){
        this.g
            .data(this.pie(data))
            .selectAll("path")
            .attr("d",this.arc)
            .style("fill", this.d_data_color);
    };

}

IDP.create_svg=function(width=300,height=300){
    var svg=d3.select("body").append("svg")
        .attr("width",width)
        .attr("height",height);
    return svg
}

layers=[
    [0.2,0.4,0.6,0.8,1],
    ["#98abc5", "#7b6888", "#6b486b", "#a05d56", "#ff8c00"]
]

class IDP_Composit{


    constructor(svg, minV=0,maxV=null,layers=layers, data=[]) {
        this.layer_vals = layers[0];
        this.layer_colors = layers[1];
        this.charts = [];
        this.width = parseInt(svg.attr("width"));
        this.height = parseInt(svg.attr("height"));
        this.radius = Math.min(this.width, this.height) / 2;
        console.log("this.radius=" + this.radius);
        var bminR=0;
        for(var i=0;i<this.layer_vals.length;i++){
            var threshold=this.layer_vals[i];
            var basecolor=this.layer_colors[i];


            this.minV=minV;
            this.maxV=maxV;

            var minR=this.minV*this.radius;
            var maxR=minR;
            if(maxV!=null)
                maxR=this.maxV*this.radius;
            else
                maxR=Math.min(this.width,this.height)/2;

            var chart=new IDP(svg,minV,maxV,data);
            this.charts[i]=chart;
            // chart.min=minR;
            // chart.max=bmaxR;
            // chart.d_outerRadius=function(d){
            //     self=chart;
            //     val=d.data.value * self.radius;
            //     console.log("val="+val+" min="+self.min+" max="+self.max + " d.data.v="+d.data.value+" this.r="+self.radius);
            //     if(val<self.min) return self.min;
            //     else if(val>self.max) return self.max;
            //     return val;
            // };
            // chart.get_min=function(){
            //     return chart.min;
            // }
            chart.d_innerRadius=minR;
            chart.d_data_color=basecolor;
            chart.d_label=function(d,i){
                var val=d.data.value * chart.radius;

                if (val>minR && val<maxR)
                    return d.data.value;
                else
                    return "";
            };
            chart.create();
            bminR=maxR;
        }
    }


    invalidate(data){
        txt="";
        data.forEach(function(d){
            txt+=d.value+","
        });
        console.log(txt);
        this.charts.forEach(function(c){
         c.invalidate(data);
        });
    }
}

// Example:
//
// //creation
// svg=IDP.create_svg(300,300);
//
// chart1= new IDP(svg,20,140,mydata);
// chart1.d_outerRadius=function(d){return d.data.value/2 + 20;};
// chart1.create();
//
// chart2 = new IDP(svg,142,150,mydata);
// chart2.d_data_color=function(d){if(d.data.flag) return "#8BBC58"; return "#9C4831";};
// chart2.d_label="";
// chart2.create();
//
//
// svg2=IDP.create_svg(300,300);
// comp=new IDP_Composit(svg2,0,150,layers,mydata);
//
//


