/*
 * Jquery 'Paginator' plug-in
 * Author: Brandon Lee Jennings
 * www.DemiGodDesign.com
 *
 *
 * Paginator instantly paginates a table client-side with minimal effort.
 * Simply call paginator on your table of choice, and it's paginated!
 *
 * I, Brandon Lee Jennings, do hereby grant full permission to use this software free of charge.
 * However, please do keep my signature to give me credit when using.
 *
 * NOTE:
 *
 * - To use this you must also include JqueryUI w/the the accompanied styles.
 * - I guess it goes without saying that you need to include Jquery as well.
 * - This only works with id's, so don't try to call a table by class name
 *
 * Example:
 * Say you got a table with an id of "paginateThis", you want 30 rows per page,
 * you'd like a nice medium fadeIn/Out effect:
 *
 *
 * $("#paginateThis").paginator(30, 300);
 *
 * That's it!
 *
 */


(function( $ ){

  $.fn.dapperTable = function(numberofrowstodisplayperpage, animationspeed) {

    var tableid = this.attr("id");
    new dapperTable(tableid, numberofrowstodisplayperpage, animationspeed)

  };
})( jQuery );



//Here's the initial JS Object I wrote for a project. Bascially, this plugin is
//an object of this instanitiated in a jquery call.
function dapperTable(tableid, numberofrowstodisplayperpage, animationspeed)
{


    this.pagenum = 1;
    //Absolute size of the table
    this.sizeoftable = $("#"+ tableid + " tr").length;
    this.count = 1;
    var self = this;
    var tableRows = $("#" + tableid + " tr").not("tr:first").get();
    /* Uncomment for dev testing */
    //numberofrowstodisplayperpage = 100;





    this.viewAll = function() {
        var page = 1;
        var count = 0;

         $.each(tableRows, function(index, row) {
            
            
            $(row).addClass("page"+ page).addClass("active");
            
            count++;
            if(count == numberofrowstodisplayperpage){

                page++;
                count = 0;

            }

            
            $("#" + tableid).children('tbody').append(row);

          });

            this.betterDisplay(1);
            this.updatePageNumHolder(page);
            

    }


    /*Build new page systems*/
    this.betterDisplay = function(pageNum){

        $("#"+tableid+" .active").hide();
        
        $("#"+tableid+" .page" + pageNum).show();
        
        
        
        //Done loading the new display
        return self.loading(1);

    }
    
    
    //This is called with an opacity level, when a function is done it returns this function with opacity set to 1
    this.loading = function(opacity){
        
        
        $("#" + tableid + " .active").css({opacity: opacity});
     
    }


    /* Allows the user to search the table and display the results */
    this.searchFor = function(searchString, index) {

      var page = 1;
      var count = 0;
      searchString = new RegExp(searchString, 'i');

        $("#" + tableid + " .active").hide().removeClass().each(function(){
            
          if(index == 'all'){

            $(this).children().each(function(){


                if($(this).text().search(searchString) != -1){

                    count++;

                    if(count == numberofrowstodisplayperpage){

                        page++;
                        count = 0;
                    }

                        $(this).parent().addClass('page'+ page).addClass('active');
                        

                }

            });
            
          }
          
          
          else
              {
                  
                  if( $(this).children('td').eq(index).text().search(searchString) != -1){
                      
                      count++;

                        if(count == numberofrowstodisplayperpage){

                            page++;
                            count = 0;
                        }

                        $(this).addClass('page'+ page).addClass('active');
                      
                  }
                  
              }
        });


        if(count == 0)
            { 
                alert("Sorry, your search didn't find anything :(");
                self.viewAll();
            }
            
        else{  
            
            this.updatePageNumHolder(page);
            this.betterDisplay(1);
        }
        

    }






    /* Sorts the table upordown is either 0 or 1; 0 for ascending, 1 for descending */
    this.sortBy = function(columnNum, upordown) {


        //Sorting the table by the column
        var rows = $("#" + tableid + " .active").removeClass().hide().get();
    

        rows.sort(function(a, b) {

            var keyA = $(a).children('td').eq(columnNum).text()
                                                      .toUpperCase();

            var keyB = $(b).children('td').eq(columnNum).text()
                                                      .toUpperCase();
            if(upordown == 0)
                {
                    if (keyA < keyB) return -1;

                    if (keyA > keyB) return 1;
                }

             if(upordown == 1)
                {
                    if (keyA > keyB) return -1;

                    if (keyA < keyB) return 1;
                }

            
        });
        
            //Now we reset paging
            var count = 0;
            var pageNum = 1;

        //Take the sorted array and append to the table, while creating the paging
        $.each(rows, function(index, row) {
            
            
            $(row).addClass("page"+ pageNum).addClass("active");
            
            count++;
            if(count == numberofrowstodisplayperpage){

                pageNum++;
                count = 0;

            }

            
            $("#" + tableid).children('tbody').append(row);

          });

          
        
         this.updatePageNumHolder(pageNum);
         this.betterDisplay(1);



    }





    /* Does exactly what you think it does */
    this.updatePageNumHolder = function(numberofpages){

        $("#"+tableid+"currentPage").val(1);
        $("#"+tableid+"numOfPage").text(numberofpages);

    }






    /* Creates all the table controls; the size of the table only gets passed once, after that it always updated*/
    this.createPageNumHolderandSortingFunctionality = function(sizeOftable)
    {

        var beginning;
        var ending;
        var current;



       
            //First we create all the elements
            
            var tableWidth = $("#" + tableid).width() - 2;
            
            var pageholder = $('<span style="display: inline-block; margin: 1px 0px 7px 0px; width:' + tableWidth +'px; " id="'+tableid+'pagenumholder" class="ui-widget-content ui-corner-all"></span>');
            
            var pagingControls = $('<span style="margin: 0px; padding: 3px; overflow: hidden;border: none; height: 35px; display: block;" class="ui-widget-header"><button id="'+tableid+'beginning"><<</button>\n\
                                <button id="'+tableid+'rewind"><</button>\n\
                                <input style="width:35px; display: inline-block; margin:3px;" id="'+tableid+'currentPage" value="1"/>\n\
                                <div style="display: inline-block; margin: 3px;" id="'+tableid+'numOfPage">\n\
                                </div><button id="'+tableid+'forward">></button>\n\
                                <button id="'+tableid+'end">>></button></span>');
            
            var search =   $('<div id="' + tableid + 'advancedControls" class="ui-widget-content" style="overflow: hidden; border:none; padding: 3px;">\n\
                              Look for<input id="'+tableid+'search" style="margin: 0px; margin: 0px 3px 0 3px" />in</div>').hide();

            var searchOptions = $("<select id='" + tableid + "column' style='margin: 4px 3px 0 3px' ><option value='all'>All columns</option></select>");
   
            var anotherSearchButton = $("<button>Search Table</button>");
            
            var reset = $('<span style="" id="'+tableid+'Reset">Reset Table</button>');
            
            var moreControls = $("<div  style='float: right; font-size: x-small !important; padding: 4px;'></div> ");
             
            var searchButton = $("<button id='" + tableid + "go'>Go</button>");   
            
            $('#' + tableid + " th").each(function(){
                
                searchOptions.append("<option value='" + $(this).index() +"'>" + $(this).text() + "</option>");
                
            });
            
            
            //Then we put them all together, and put it at the end of the table
            pagingControls.append(moreControls);
            
            moreControls.append(anotherSearchButton, reset);   
            
            search.append(searchOptions);
            
            searchOptions.after(searchButton);
            
            pageholder.append(pagingControls, search);
        
            $("#"+tableid).after(pageholder);
        
        
        
    
        var numberofpages = Math.ceil(sizeOftable/numberofrowstodisplayperpage);

        //Populating number of pages
        $("#"+tableid+"numOfPage").text(numberofpages);




        //Series function calls on buttons for paging functionality
        $( "#"+tableid+"beginning" ).button({
            text: false,
            icons: {
                primary: "ui-icon-seek-start"
            }
        }).click(function(){

                    self.betterDisplay(1);
                    $("#"+tableid+"currentPage").val(1);

                });



        $( "#"+tableid+"rewind" ).button({
            text: false,
            icons: {
                primary: "ui-icon-seek-prev"
            }
        }).click(function(){

                   current = $("#"+tableid+"currentPage").val();
                   if(current != 1){

                        current--;
                        $("#"+tableid+"currentPage").val(current);
                        self.betterDisplay(current);

                    }

                });


                $( "#"+tableid+"forward" ).button({
            text: false,
            icons: {
                primary: "ui-icon-seek-next"
            }
        }).click(function(){

                   current = $("#"+tableid+"currentPage").val();
                   numberofpages = $("#"+tableid+"numOfPage").text();
                   if(current != numberofpages){

                        current++;
                        $("#"+tableid+"currentPage").val(current);
                        self.betterDisplay(current);

                    }


                });



        $( "#"+tableid+"end" ).button({
            text: false,
            icons: {
                primary: "ui-icon-seek-end"
            }
        }).click(function(){

                    numberofpages = $("#"+tableid+"numOfPage").text();
                    $("#"+tableid+"currentPage").val(numberofpages);
                    self.betterDisplay(numberofpages);

                });




                //Functionality for when the input field for page num is changed
                $("#"+tableid+"currentPage").change(function(){
                    
                   numberofpages = $("#"+tableid+"numOfPage").text();
                   numberofpages = numberofpages * 1;
                   current = $("#"+tableid+"currentPage").val();
                
                   if(current >= 1 && current <= numberofpages){
                       
                            
                            self.betterDisplay(current);
                       
                    }
                })



                /* Search Functionality */
                
                searchButton.button({
                    icons: {
                        primary: "ui-icon-search"}
                    }).click(function(){

                   var searchString = $('#'+ tableid + "search").val();
                   var index = $("#"+ tableid + "column").val();
  
                   self.loading(.3);
                   setTimeout(function(){self.searchFor(searchString, index)}, 200);

                })




                var headers = $("#" + tableid + " th");
                headers.addClass('ui-state-default');

                headers.hover(function(){ $(this).addClass('ui-state-active')}, function(){$(this).removeClass('ui-state-active')})

                
                 var asc = $("<span style='display: inline-block;' class='ui-icon ui-icon-triangle-1-n'></span>");
                 var desc = $("<span style='display: inline-block;' class='ui-icon ui-icon-triangle-1-s'></span>");
               
               /* Sort Functionality */
                headers.toggle(function(){
                                asc.remove();
                                $(this).append(desc);

                                self.loading(.3);  
                                var tableIndex = $(this).index();
                                
                                setTimeout(function(){self.sortBy(tableIndex, 0)},200);

                            }, function(){
                                
                                $(this).append(asc);
                                desc.remove();

                                self.loading(.3);  
                                var tableIndex = $(this).index();
                                
                                setTimeout(function(){self.sortBy(tableIndex, 1)},200);

                            }).css('cursor', 'pointer');
                            
                //  
               anotherSearchButton.button({icons:{primary: 'ui-icon-search'}}).toggle(
                    function(){search.slideDown()},
                    function(){search.slideUp();}
                );   
                            
                            
               /* Reset */
               reset.button({icons:{primary: 'ui-icon-refresh'}}).click(function(){
                   
                   self.loading(.3);
                   setTimeout(function(){self.viewAll()},200);
                   
               })

        
    }



    /* Constructor */
    this.construct = function()
    {
        var counter = 0;
        $("#"+ tableid + " tr").not("tr:first").hide();  
        $("#" + tableid).addClass("sortable");
        this.viewAll();
        this.createPageNumHolderandSortingFunctionality(this.sizeoftable);
        

    }


    /*I wish Javascript had more straightforward constructors.*/
    this.construct();


}








