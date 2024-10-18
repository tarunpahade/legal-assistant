/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RefreshCcw,
  CornerUpLeft,
  Trash,
  Loader,
} from "lucide-react";
import axios from "axios";
import Header from "@/components/header";

export default function Component() {
  // const [data, setData] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [pdfData, setPdfData] = useState<string>("");
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(
    null
  ); // State for selected namespace
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const [prompt, setPrompt] = useState<string>("");

  const [documentItems, setDocumentItems] = useState<
    { name: string; url: string }[]
  >([]); // State for document items

  const [conversation, setConversation] = useState<
    {
      role: string;
      text: string;
      source?: {
        pageNumber: string;
        linesFrom: string;
        linesTo: string;
      };
    }[]
  >([]);
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

      const response = await axios.post("/api/user/upload", formData, {
        headers: {
          "Content-Type": "application/pdf",
        },
        responseType: "json",
      });

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

  const handleClick = async () => {
    try {
      if (!selectedNamespace) {
        alert("Please select a namespace.");
        return;
      }
      setPrompt("");

      setConversation((prev) => [...prev, { role: "User", text: prompt }]);
      setLoading(true); // Set loading to true when starting the request

      const response = await axios.post("/api/user/chat", {
        query: prompt,
        namespace: selectedNamespace,
      });
      console.log(response.data);

      setConversation((prev) => [
        ...prev,
        {
          role: "Assistant",
          text: response.data.answer,
          source: response.data.sources,
        },
      ]);
      console.log(conversation);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Function to handle viewing a document
  const handleViewDocument = (name: string) => {
    setSelectedNamespace(name);
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
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {conversation.map((entry, index) => (
                <div key={index} className="rounded-lg mb-3 bg-blue-50 p-4">
                  <p className="text-xs font-semibold text-gray-700">
                    {entry.role}:
                  </p>
                  <p className="text-xs text-gray-600 p-2">{entry.text}</p>
                  {entry.role === "Assistant" ? (
                    <p className="text-xs text-gray-600 p-2">
                   {`Line`}   {entry.source?.linesFrom} {`to`} {entry.source?.linesTo}
                   {` Page`}   {entry.source?.pageNumber}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
              {loading && <Loader />}
            </div>
          </ScrollArea>
          <footer className="border-t p-4">
            <div className="flex items-center space-x-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 text-sm"
                placeholder="Ask ai..."
              />
              <Button size="sm" onClick={handleClick}>
                Send
              </Button>
            </div>
            <div className="mt-4 ">
              <div className="flex text-xs font-semibold  justify-between">
                <h3 className="mb-2 ">Documents</h3>
                <div className="flex">
                  <Button
                    className="p-3 mb-2 "
                    onClick={fetchDocumentItems}
                    size={"sm"}
                  >
                    <RefreshCcw className="h-3 w-3 " />
                  </Button>
                  <Input
                    type="file"
                    placeholder="Upload Document"
                    onChange={handleFileChange} // Capture file input
                  />

                  <Button
                    className="mb-2  p-3  "
                    size="sm"
                    onClick={handleFileUpload}
                  >
                    Upload
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {documentItems.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between rounded-md h-8 bg-gradient-to-r from-gray-100 to-gray-200 px-2 text-xs"
                  >
                    <span className="truncate">{doc.name}</span>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocument(doc.name)}
                      >
                        <CornerUpLeft
                          className={`h-3 w-3 ${
                            selectedNamespace === doc.name
                              ? "bg-black text-white"
                              : "bg-gradient-to-r from-gray-100 to-gray-200"
                          }`}
                        />
                        <span className="sr-only">View document</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.name)}
                      >
                        <Trash className="h-3 w-3 mt-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
