<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Notepad.aspx.cs" Inherits="NotepadOnline.Notepad" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <meta charset="UTF-8" name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="Styles/stylesheet.css"/>

    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type = "text/javascript" src = "JavaScript.js"></script> 

    <title>Notepad Online</title>

</head>
<body>
    <h1>Notepad Online</h1> 
    <form id="form1" runat="server" onsubmit="return false">
            
        <label for="FilesList">Select a file:</label>
        <asp:DropDownList ID="FilesList" runat="server" />
        <asp:button ID="SaveButton" runat="server" Text="Save" Enabled="false" />
        
        <asp:Button ID="SaveAsButton" runat="server" Text="Save As"/>
        <input id="FileName" type="text" runat="server" />
        
        
         
        <textarea id="TextEditor" ></textarea>

         <div id="SaveStatus"></div>

    </form>

 

</body>
</html>
