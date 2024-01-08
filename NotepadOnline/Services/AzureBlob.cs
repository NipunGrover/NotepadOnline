using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NotepdOnline.Services
{
    using Azure.Storage.Blobs;
    using System;
    using System.Configuration;

    namespace NotepadOnline.Services
    {
        public class AzureBlob
        {
            private readonly string connectionString;
            private readonly BlobServiceClient blobServiceClient;

            //constructor
            public AzureBlob()
            {
                //getting the connection string from the web.config file
                string connectionString = ConfigurationManager.ConnectionStrings["AzureStorageConnectionString"].ConnectionString;

                //if the connectionString is null, throw an exception
                connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));

                //otherwise, create a new BlobServiceClient
                this.blobServiceClient = new BlobServiceClient(connectionString);
            }


            //note: blobName is the name of the file appended with .txt, blob name can be taken from the files list
            //get the blob client to upload the file to the blob storaage client
            public BlobClient GetBlobClient(string blobName)
            {
                string containerName = ConfigurationManager.AppSettings["BlobContainerName"];
                BlobContainerClient containerClient = GetContainerClient(containerName);
                return containerClient.GetBlobClient(blobName);
            }


            //if the container does not exist, create a new container
            private BlobContainerClient GetContainerClient(string containerName)
            {
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

                if (!containerClient.Exists())
                {
                    containerClient = blobServiceClient.CreateBlobContainer(containerName);
                }

                return containerClient;
            }
        }
    }

}