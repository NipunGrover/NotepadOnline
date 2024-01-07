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


namespace NotepadOnline
{
    public partial class Notepad : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // disable unobtrusive validation warning
            ValidationSettings.UnobtrusiveValidationMode = UnobtrusiveValidationMode.None;
        }


        [WebMethod]
        public static string SaveFile(string fileName, string fileContent)
        {
            string returnData;
            string saveStatus;

            try
            {
                //building file path, mappath is used to get the physical path of the directory Files
                string path = HttpContext.Current.Server.MapPath("Files");
                path = path + @"\" + fileName + ".txt";


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



        [WebMethod]
        public static string SaveAs(string fileName, string fileContent)
        {
            string returnData;
            string saveStatus;

            try
            {
                //building file path, mappath is used to get the physical path of the directory Files
                string path = HttpContext.Current.Server.MapPath("Files");
                path = path + @"\" + fileName + ".txt";


                if (!File.Exists(path))
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

        [WebMethod]
        public static string OpenFile(string fileToLoad)
        {
            string returnData = "";
            string openStatus;
            string fileContents = "";

            try
            {
                //building file path, mappath is used to get the physical path of the directory Files
                string path = HttpContext.Current.Server.MapPath("Files");
                path = path + @"\" + fileToLoad;

                if (File.Exists(path))
                {
                    openStatus = "Success";
                    fileContents = File.ReadAllText(path);
                }
                else
                {
                    openStatus = "Failure";
                    fileContents = "File doesn't exist";
                }
            }

            catch (Exception e)
            {
                openStatus = "Exception" + e;
            }
            return returnData;
        }




        [WebMethod]
        public static string PopulateFileList()
        {
            // building the path for "MyFiles" directory present in solution
            string currentDirectory = HttpContext.Current.Server.MapPath("Files");
            string path = Path.Combine(currentDirectory);

            // getting all of the files from path
            string[] files = Directory.GetFiles(path);

            // populating list with name of every file in path
            List<string> filesList = new List<string>();

            foreach (string file in files)
            {
                filesList.Add(Path.GetFileName(file));
            }


            // sending response for the ajax call
            string returnData = JsonConvert.SerializeObject(new { fileNames = filesList });
            return returnData;
        }
    }

    /*three basic main elements needed are save, save and open file. save save as will be done first, */

    


}