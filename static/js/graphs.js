/*väntar med att skapa graf tills data är laddat*/
queue()
    .defer(d3.csv, "data/payroll.data.csv")
    .await(makeGraphs);
    
/*skapar graf och hämtar data*/
function makeGraphs(error, payrollData) {
    var ndx = crossfilter(payrollData);
    var type_dim  = ndx.dimension(function (d) {
        return ((d["Type"] = "Taxes") 
            && (d["Type"] = "Nettpay")
            && (d["Type"] = "Social Security Fees"));
    });
    var total_cost_pie_chart = type_dim.group().reduceSum(dc.pluck('Sum'));
    
dc.pieChart('#total-cost-pie-chart')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(type_dim)
        .group(total_cost_pie_chart);
        
    dc.renderAll();

}
    
     /*var type_dim = ndx.dimension(function(d) { return d["Type"] = "Taxes"} &&  );
    /*varför inte skapa en dimension för varje av de 3 jag vill ha? type=xx */
    
    /*var type_dim_filter = function(type_dim){return d.Type = if };*/
    
    /* var payroll cost. för varje cell i excellen sparas som var payroll cost. den avriabeln stämms sedan av mot de data jag vill ha
    var payroll_cost;
    går igenom varje cell (payroll_cost) of ndx och utför if else statemwent för varje cell
    for (payroll_cost of ndx){
        if (payroll_cost = "Taxes"){dc.pluck('Sum')}
        else if (payroll_cost = "Social Security Fees"){dc.pluck('Sum')}
        else if (payroll_cost = "Nettpay"){dc.pluck('Sum')}
    }
     tror att dc.pluck('Sum')} ovan är fel. måste addera ihopp summorna på annat sätt*/

    
    