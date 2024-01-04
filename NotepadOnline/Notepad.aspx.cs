using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace NotepdOnline
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // disable unobtrusive validation warning
            ValidationSettings.UnobtrusiveValidationMode = UnobtrusiveValidationMode.None;
        }


        [WebMethod]


        public static string SaveFile(string fileName, string fileContent)
        {
            string returnData = "";
            string saveStatus;

         

          
            try
            {
                //building file path, mappath is used to get the physical path of the directory Files
                string path = HttpContext.Current.Server.MapPath("Files");
                path = path + @"\" + fileName;


                if (File.Exists(path))
                {
                    saveStatus = "Success";

                    //writing content to the file
                    File.WriteAllText(path, fileContent);
                }
                else
                {
                    saveStatus = "Failure";
                }
            }
            catch (Exception e)
            {
                saveStatus = "Exception" + e;

            }

            returnData = JsonConvert.SerializeObject(new { status = saveStatus });
            return returnData;
        }
    }

    /*three basic main elements needed are save, save and open file. save save as will be done first, */

    
}