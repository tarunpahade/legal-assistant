/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CornerUpLeft, Trash } from "lucide-react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openAIAPI, setOpenaiapi] = useState(null);

  const [documentItems, setDocumentItems] = useState<
    { name: string; url: string }[]
  >([]); // State for document items

  const token: string = "YOUR_BEARER_TOKEN"; // Replace with your actual token

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchDocumentItems();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchDocumentItems = async () => {
    const response = await axios.get("/api/user/pdf/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const namespaces = response.data.namespaces || [];
    const updatedDocumentItems = namespaces.map((name: string) => ({
      name,
      url: `/docs/${name}`, // Assuming the documents are stored in the /docs/ directory
    }));
    setDocumentItems(updatedDocumentItems);
  };

  const handleFileUpload: () => Promise<void> = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      console.log("lalal");

      const formData = new FormData();
      formData.append("pdfFile", selectedFile); // Append the file directly
      console.log(JSON.stringify(formData));
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      if (openAIAPI == null) {
        alert("Please select an API to use");
      }
      const response = await axios.post(
        "/api/user/upload",
        { formData, openAIAPI },
        {
          headers: {
            "Content-Type": "application/pdf",
          },
          responseType: "json",
        }
      );

      console.log("Backend response:", response.data);
      // Handle the response from the backend here

      alert("PDF processed successfully!");
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Error processing PDF.");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]); // Save the selected file
    }
  };

  // Function to handle viewing a document
  const handleViewDocument = (name: string) => {
    console.log(`Viewing document: ${name}`);
    // You can add additional logic here, such as navigating to the document or displaying it
  };

  // Function to handle deleting a document
  const handleDeleteDocument = async (name: string) => {
    try {
      const encodedName = encodeURIComponent(name); // Encode the name to handle spaces
      console.log(encodedName);

      const response = await axios.post(`/api/user/delete`, {
        name: encodedName,
      }); // Send name in the request body

      if (response.status === 200) {
        // Check for successful response
        setDocumentItems((prevItems) =>
          prevItems.filter((doc) => doc.name !== name)
        );
        console.log(`Deleted document: ${name}`, response.data);
        // Optionally call fetchDocumentItems() if needed
      } else {
        alert("Error in the codebase");
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div className="flex w-screen bg-gray-50">
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <Header />
          <main className="flex-grow p-6">
            <div className="flex-col column items-center justify-between mb-6">
              <h1 className="text-2xl font-bold mx-auto max-w-xl  mb-2">
                Upload documents
              </h1>
              <div className="ml-[20%]">
                <Input
                  value={openAIAPI!}
                  className="max-w-xl "
                  onChange={(e: any) => setOpenaiapi(e.target.value)}
                  placeholder="Enter the OpenAI API"
                />
              </div>
            </div>
            <Tabs defaultValue="upload" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Drag and Drop or Browse files
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {" "}
                    supports .pdf document formats
                  </p>
                  <label htmlFor="file-upload">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      id="file-upload"
                    />

                    {/* <Button variant="outline" className="mr-2">Browse files</Button> */}
                  </label>
                  {/* {selectedFile && ( // Check if a file is selected
                <span className="ml-2 text-gray-600">{selectedFile.name}</span> // Display the file name
              )} */}
                  <Button onClick={handleFileUpload}>Upload</Button>
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="space-y-2">
                  {documentItems.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between rounded-md bg-gray-100 p-3 text-sm"
                    >
                      <span className="truncate">{doc.name}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDocument(doc.name)}
                        >
                          <CornerUpLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.name)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </main>
    </div>
  );
}
