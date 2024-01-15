// global variable - for use in jQuery (AJAX) calls
var jQueryXMLHttpRequest;


$(document).ready(function () {

    // setting ajax handlers
    $("#SaveButton").click(Save);
    $("#SaveAsButton").click(SaveAs);
    $("#FilesList").change(OpenFile);

    PopulateFileList();

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
    let contentToSave = document.getElementById("TextEditor").value;


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
                document.getElementById("SaveStatus").innerHTML = "File Save Status: <b>" + response.status + "</b>";

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
function SaveAs(overwrite = false) {
    // retrieving file name and text for file
    var selectedFile = document.getElementById("FileName").value;

    if (validateFileName() === false) { return; }

    var contentToSave = document.getElementById("TextEditor").value;

    // constructin json string to send for ajax query
    var jsonData = { fileName: selectedFile, fileContent: contentToSave, overwrite: overwrite };
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

                if (response.status === "File Exists") {
                    var overwrite = confirm("File already exists. Do you want to overwrite it?");
                    if (overwrite === false) {
                        document.getElementById("SaveStatus").innerHTML = "File save status : <b>File not saved</b>";
                        return;

                    }
                    else if (overwrite === true)
                    {
                        document.getElementById("SaveStatus").innerHTML = "File Save status : <b>" + "File Overwritten" + "</b>";

                        //call the save function with true parameter to write data to the file
                        SaveAs(true);

                        //disabling the save button because the file has been saved
                        $('#SaveButton').prop('disabled', true);
                    }

                }
                else {
                    //if the Save as button was calld with true parameter, then we dont want to display the status like this
                    if (overwrite == false)
                    { 
                    document.getElementById("SaveStatus").innerHTML = "File Save status : <b>" + response.status + "</b>";
                    }

                    // disabling the save button because the file has been saved
                    $('#SaveButton').prop('disabled', true);

                    //updating the dropdown list
                    PopulateFileList();
                }
            
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
    var regex = /[!@$%^&*_+\-=\[\]{};':"\\|,.<>\/?]+/;
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
function OpenFile() {

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
        url: "Notepad.aspx/OpenFile",         // sending data to appropriate method
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
            console.log("file  does not exist");
            document.getElementById("SaveStatus").innerHTML = "The call to the WebMethod failed!";
        }

    });
}//fn OpenFile ends here



function PopulateFileList() {

    var dropdown = document.getElementById("FilesList");

    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "Notepad.aspx/PopulateFileList",
        data: null,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data.d != null) {
                var response;

                response = $.parseJSON(data.d);
                $("#FilesList").empty();
                // adding an empty option for files
                var emptyOption = document.createElement('option');
                emptyOption.text = "Select a file";
                emptyOption.value = "";
                dropdown.add(emptyOption);

                $.each(response.fileNames, function (index, value) {
                    var option = document.createElement('option');
                    option.value = index;
                    option.text = value;

                    // Appending the option to the DropDownList
                    dropdown.add(option);
                });

                dropdown.onchange = function () {
                    // If the "Select a file" option is still present, remove it
                    if (this.options[0].value === "") {
                        this.remove(0);
                    }
                };
            }


        },
        fail: function () {
            document.getElementById("SaveStatus").innerHTML = "The call to the WebMethod failed!";
        }

    });
}
