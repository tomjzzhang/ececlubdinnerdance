$(function() {
    $('.btn-danger').click(function() {
        return window.confirm("Are you sure?");
    });
});

$(document).ready(function() 
    { 
        $("#manage-table1").tablesorter(); 
    } 
); 