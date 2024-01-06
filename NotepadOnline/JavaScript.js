﻿// global variable - for use in jQuery (AJAX) calls
var jQueryXMLHttpRequest;


$(document).ready(function () {

    // setting ajax handlers
    $("#SaveButton").click(Save);
    $("#SaveAsButton").click(SaveAs);
/*    $("#FilesList").Change(OpenFile);*/

    //whenever there is a change in the text box, enable the save button
    $('#TextEditor').on('input change', function (e) {
        console.log('TextEditor input or change event triggered');
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

    if (validateFileName() === false) { return; }

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

}//fn SaveAs ends here


function validateFileName() {
    var fileName = document.getElementById('FileName').value;

    // Check if the file name is blank
    if (fileName === '') {
        alert('File name cannot be BLANK.');
        return false;
    }

    // Check if the file name contains special characters
    var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (regex.test(fileName)) {
        alert('File name cannot contain special characters.');
        return false;
    }

    return true;
}



    /*
Name    :   OpenFile
Purpose :   Load the content of a selected file using AJAX.
Inputs  :   None
Outputs :   Displays the loaded file's content and status on the page.
Returns :   None
*/
/*    function OpenFile() {

        // Get the select element
        let dropdown = document.getElementById("FilesList");

        //get the text associated with selected element
        let selectedFile = dropdown.options[dropdown.selectedIndex].text;


        // clearing ui if user chooses empty value for file
        if (selectedFile.trim() === "") {
            document.getElementById("SaveStatus").innerHTML = "";
            document.getElementById("TextEditor").value = "";
            return;
        }

        let jsonData = { fileToLoad: selectedFile };
        let jsonString = JSON.stringify(jsonData);

        jQueryXMLHttpRequest = $.ajax({
            type: "POST",
            url: "startPage.aspx/OpenFile",         // sending data to appropriate method
            data: jsonString,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null && data.d != null) {
                    var response;
                    // updating text box with data received in response
                    response = $.parseJSON(data.d);

                    document.getElementById("TextEditor").value = response.description;

                    document.getElementById("SaveStatus").innerHTML = "File loading status : <b>" + response.status + "</b>";


                }
            },
            fail: function () {
                document.getElementById("SaveStatus").innerHTML = "The call to the WebMethod failed!";
            }

        });
*/



