// global variable - for use in jQuery (AJAX) calls
var jQueryXMLHttpRequest;


$(document).ready(function () {

    // setting ajax handlers
    $("#SaveButton").click(Save);
    $("#SaveAsButton").click(SaveAs);

    //whenever there is a change in the text box, enable the save button
    $('#TextEditor').on('input change', function (e) {

        $('#SaveButton').prop('disabled', false);
        /*we are keeping the save as button enabled at all times because it is not a destructive action and one can save as many times as they want 
          and it is also possible to save blank files. All in all it is not bound to changes in the text area */
    });

});


/*
    Name    :   Save
    Purpose :   Save the content of the text box to a selected file using AJAX.
    Inputs  :   None
    Outputs :   Displays the status of the save operation on the page.
    Returns :   None
*/
function Save()
{
    let dropdown = document.getElementById("FilesList");

    //get the name for the file from the dropdown list
    let selectedFile = dropdown.options[dropdown.selectedIndex].text;
    let contentToSave = document.getElementById("TextEditingBox").value;


    //checking if no file was selected
    if (selectedFile.trim() === "") {
        document.getElementById("SaveStatus").innerHTML = "please select a file";
        return;
    }

    //making the json string to send for ajax query
    let data = JSON.stringify({ "fileName": selectedFile, "fileContent": contentToSave });

    //making the ajax call
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "Notepad.aspx/SaveFile",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (responseData) {

            if (responseData != null && response.d != null)
            {
                response = $.parseJSON(data.d);
                document.getElementById("SaveStatus").innerHTML = "File Status: <b>" + response.status + "</b>";

                $('#SaveButton').prop('disabled', true);

            }
        },
        fail: function (response) {
            document.getElementById("SaveStatus").innerHTML = "the call to the save function failed: \n <b>" + response.status + " " + response.statusText + "</b>" ;
        }
    });
}


/*
Name    :   SaveAs
Purpose :   Save the content of the text box as a new file using AJAX.
Inputs  :   None
Outputs :   Displays the status of the save as operation on the page.
Returns :   None
*/
function SaveAs() {
    // retrieving file name and text for file
    var selectedFile = document.getElementById("FileName").value;

    if (selectedFile.trim() === "") {
        document.getElementById("SaveStatus").innerHTML = "";
        Page_ClientValidate();
        return;
    }

    var contentToSave = document.getElementById("TextEditor").value;

    // constructin json string to send for ajax query
    var jsonData = { fileName: selectedFile, fileContent: contentToSave };
    var jsonString = JSON.stringify(jsonData);


    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "Notepad.aspx/SaveAs",           // sending data to appropriate method
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            if (data != null && data.d != null) {
                var response;

                response = $.parseJSON(data.d);

                document.getElementById("SaveStatus").innerHTML = "File saving as status : <b>" + response.status + "</b>";

                $('#SaveButton').prop('disabled', true);
            }

        },
        fail: function () {
            document.getElementById("SaveStatus").innerHTML = "The call to the WebMethod failed!";
        }

    });
}