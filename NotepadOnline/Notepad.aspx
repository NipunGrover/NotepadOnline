<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Notepad.aspx.cs" Inherits="NotepdOnline.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <meta charset="UTF-8" name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="Styles/stylesheet.css"/>

    <title>Notepad Online</title>

</head>
<body>
    <form id="form1" runat="server" onsubmit="return false">

         <textarea id="TextEditor" cols="20" rows="2"></textarea>
         <div id="errorMessage"></div>


    </form>
</body>
</html>
