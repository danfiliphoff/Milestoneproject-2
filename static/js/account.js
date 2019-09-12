/*steg: 
1. skapa HTML.
2. skapa function
3.lägg till function under make graph*/

/*väntar med att skapa graf tills data är laddat*/
queue()
    .defer(d3.csv, "data/account.csv")
    .await(makeAccountDataGraphs);
    

function makeAccountDataGraphs(error, account){
    
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    account.forEach(function(d){
        d.PaymentDate = parseDate(d.PaymentDate);
    });

   /* converts all accounts and Sums to integers*/
    account.forEach(function(d){
        d.Account = parseInt(d.Account, 10);
    });
    
    account.forEach(function(d){
        d.Sum = parseInt(d.Sum, 10);
    });
    
    
   var ndx=crossfilter(account);
   salary_type_selector(ndx);
   cost_per_account(ndx);
   cost_per_type(ndx);
   cost_over_time(ndx);
   dc.renderAll();
}


function salary_type_selector(ndx){
    var salary_type_selector_dim = ndx.dimension(dc.pluck('Type'));
    var salary_type_selector_group = salary_type_selector_dim.group();
    
    dc.selectMenu("#salary-type-selector")
        .dimension(salary_type_selector_dim)
        .group(salary_type_selector_group);
}

function cost_over_time(ndx) {
    var cost_over_time_dim = ndx.dimension(dc.pluck("PaymentDate"));  
    var cost_over_time_group = cost_over_time_dim.group().reduceSum(dc.pluck('Sum'));
    
    var minDate = cost_over_time_dim.bottom(1)[0].PaymentDate;
    var maxDate = cost_over_time_dim.top(1)[0].PaymentDate;
  
    dc.lineChart('#Cost-Over-Time')  
        .width(1000)  
        .height(500)  
        .useViewBoxResizing(true)
        .margins({top: 10, right: 150, bottom: 30, left: 150})
        .dimension(cost_over_time_dim)  
        .elasticY(true)
        .group(cost_over_time_group)  
        .transitionDuration(500)  
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxis().ticks(15);
        }




function cost_per_account(ndx) {
    var cost_per_account_dim = ndx.dimension(dc.pluck("Account"));
    var cost_per_account_group = cost_per_account_dim.group().reduceSum(dc.pluck('Sum'));
 
    /*räknar ihopp totalen men funkar ej
   var total= cost_per_account_dim.groupAll().reduceSum(function (d) {
       return +d.Sum;
   });
   console.log(total);
   
    dc.numberDisplay("#total")
        .valueAccessor(function(d){
            console.log(d);
            return +d.Sum})
        .group(total);*/

         

    dc.pieChart('#cost-per-account')
        .height(500)
        .width(500)
        .useViewBoxResizing(true)
        .radius(240)
        .innerRadius(150)
        .transitionDuration(1500)
        .dimension(cost_per_account_dim)
        .group(cost_per_account_group)
        .slicesCap(6)
        .legend(dc.legend()
            .x(140)
            .y(180)
            .itemHeight(13)
            .gap(9)
            .legendText(
                function(d) {
                  /* console.log(d);för att se vilka nycklar (d.xx, d.något) som ska användas använd den här consolelog*/
                    return d.name + " - " + d.data + " " + "KR (" 
            +  Math.round((d.data/(10241617/100))*100)/100 + "%)"})
            )
        .renderLabel(false);
}

function cost_per_type(ndx){
    var cost_per_type_dimension = ndx.dimension(dc.pluck("Type"));
    var cost_per_type_group = cost_per_type_dimension.group().reduceSum(dc.pluck('Sum'));
    var filtered_cost_per_type_group = remove_empty_bins(cost_per_type_group);
    
    function remove_empty_bins(cost_per_type_group) {
    return {
        all:function () {
            return cost_per_type_group.all().filter(function(d) {
                return d.value !== 0; // if integers only
             });
            }
           };
          }
    
    
     dc.barChart('#Cost-Per-Type')
            .width(1700)
            .height(700)
            .useViewBoxResizing(true)
            .margins({top: 10, left: 150, right: 150, bottom: 200})
            .dimension(cost_per_type_dimension)
            .group(filtered_cost_per_type_group)
            .transitionDuration(500)
            .renderLabel(true)/*gets total label for whole bar*/
            .elasticX(true)
            .elasticY(true)
            .gap(15)
            .centerBar(true)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .on('renderlet',function (chart) {
                    chart.selectAll("g.x text")
                      .attr('dx', '-10')
                      .attr('transform', "translate(10,0) rotate(-35)");
                });
            
}

