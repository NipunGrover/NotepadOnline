<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Notepad.aspx.cs" Inherits="NotepdOnline.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <meta charset="UTF-8" name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="Styles/stylesheet.css"/>

    <title>Notepad Online</title>

</head>
<body>
    <h1>Notepad Online</h1> 
    <form id="form1" runat="server" onsubmit="return false">
            
        
         <asp:button ID="SaveButton" runat="server" Text="Save" Enabled="false" />
        
        <asp:button ID="SaveAsButton" runat="server" Text="Save As" ValidationGroup="SaveAsGroup"/>
        <asp:RequiredFieldValidator ValidationGroup="SaveAsGroup" ID="fileNameValidator" runat="server" ErrorMessage="RequiredFieldValidator" Text="File name cannot be BLANK." ControlToValidate="fileName"></asp:RequiredFieldValidator>
        <input id="fileName" type="text" runat="server" />
         
        <textarea id="TextEditor" ></textarea>
        <div id="SaveStatus"></div>


    </form>
</body>
</html>
