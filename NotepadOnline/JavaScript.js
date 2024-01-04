// global variable - for use in jQuery (AJAX) calls
var jQueryXMLHttpRequest;


$(document).ready(function () {

    // setting ajax handlers
    $("#SaveButton").click(Save);
    $("#SaveAsButton").click(SaveAs);
    $("#FilesList").change(OpenFile);
    PopulateFileList();

    //whenever there is a change in the text box, enable the save button
    $('#TextEditingBox').on('input change', function (e) {

        $('#SaveButton').prop('disabled', false);
        /*we decided to keep the save as button enabled at all times because it is not a destructive action and one can save as many times as they want 
          and it is also possible to save blank files. All in all it is not bound to changes in the text area */
    });

}