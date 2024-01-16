using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Newtonsoft.Json;
using NotepdOnline.Services.NotepadOnline.Services;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace NotepadOnline
{
    public partial class Notepad : System.Web.UI.Page
    {

        private static readonly AzureBlob azureBlob = new AzureBlob();

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

                //append .txt to the file name
                fileName = fileName + ".txt";

                //costruct the path
                path = path + @"\" + fileName;

                

                if (File.Exists(path))
                {
                    saveStatus = "Success";

                    //writing content to the file
                    File.WriteAllText(path, fileContent);

                    //get the blob client to upload the file to the blob storaage client
                    //GetBlob client will generate a container if one doesn't exist before
                    BlobClient blobClient = azureBlob.GetBlobClient(fileName);

                    // Convert the file content to a byte array
                    byte[] byteArray = Encoding.UTF8.GetBytes(fileContent);

                    // Create a MemoryStream with the byte array
                    using (MemoryStream stream = new MemoryStream(byteArray))
                    {
                        // Upload the file content to the blob
                        blobClient.Upload(stream);
                    }
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
        public static string SaveAs(string fileName, string fileContent, bool overwrite = false)
        {
            string returnData;
            string saveStatus;

            try
        {
            // Append .txt to the file name
            fileName = fileName + ".txt";

            // Get the blob client to upload the file to the blob storage
            AzureBlob azureBlob = new AzureBlob();
            BlobClient blobClient = azureBlob.GetBlobClient(fileName);

            // Check if the blob exists
            if (!blobClient.Exists() || overwrite == true)
            {
                // Convert the file content to a byte array, the file content is filled in the js 
                byte[] byteArray = Encoding.UTF8.GetBytes(fileContent);

                // Create a MemoryStream with the byte array
                using (MemoryStream stream = new MemoryStream(byteArray))
                {
                    // Upload the file content to the blob
                    blobClient.Upload(stream, overwrite: overwrite);
                }

                saveStatus = "Success";
            }
            else
            {
                saveStatus = "File Exists";
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
                AzureBlob azureBlob = new AzureBlob();
                string blobName = fileToLoad;

                BlobClient blobClient = azureBlob.GetBlobClient(blobName);

                if ( blobClient.Exists())
                {
                    BlobDownloadInfo download =  blobClient.Download();

                    using (StreamReader reader = new StreamReader(download.Content))
                    {
                        fileContents = reader.ReadToEnd();
                        returnData = JsonConvert.SerializeObject(new { status = "Success", description = fileContents });
                        return returnData;
                    }
                }
                else
                {
                    
                    returnData = JsonConvert.SerializeObject(new { status = "Failure", description = "File doesn't exist" });
                    return returnData;
                }
            }

            catch (Exception e)
            {
                openStatus = "Exception" + e;
            }

            returnData = JsonConvert.SerializeObject(new { status = openStatus, description = fileContents });
            return returnData;
        }




        [WebMethod]
        public static string PopulateFileList()
        {
            // Get the blob container client
            string containerName = ConfigurationManager.AppSettings["BlobContainerName"];
            AzureBlob azureBlob = new AzureBlob();
            BlobContainerClient containerClient = azureBlob.GetContainerClient(containerName);

            //// getting all of the files from path
            //string[] files = Directory.GetFiles(path);

            // populating list with name of every file in path
            List<string> filesList = new List<string>();

            foreach (BlobItem file in containerClient.GetBlobs())
            {
                 filesList.Add(file.Name);
            }


            // sending response for the ajax call
            string returnData = JsonConvert.SerializeObject(new { fileNames = filesList });
            return returnData;
        }
    }

    /*three basic main elements needed are save, save and open file. save save as will be done first, */

    


}