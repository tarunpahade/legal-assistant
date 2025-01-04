/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from '@pinecone-database/pinecone';
import Users from "@/dbconfig/dbconfig";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get("pdfFile") as File;
    // console.log(pdfFile,'lala');

    if (!pdfFile) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    // Create a temporary file
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempDir = os.tmpdir();
    const tempFilePath = join(tempDir, pdfFile.name);
    await writeFile(tempFilePath, buffer);

    // Use the file's path to create a PDFLoader
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    console.log(docs[0]); // Log the first document

    // Clean up: remove the temporary file
    await unlink(tempFilePath);

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const allSplits = await splitter.splitDocuments(docs);
        const embeddings = new OpenAIEmbeddings({
          apiKey: process.env.OPENAI_API_KEY,
          batchSize: 512,
          model: "text-embedding-3-small",
        });     
        console.log(process.env.PINECONE_API_KEY);

            const embeddedDocuments = await embeddings.embedDocuments(
          allSplits.map(split => split.pageContent)
        );

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });
    const index = pc.Index(process.env.PINECONE_INDEX!)
 

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: pdfFile.name,
      textKey: 'text',
    });

    // Upsert the embedded documents into Pinecone
    await vectorStore.addVectors(
      embeddedDocuments,
      allSplits.map(split => ({ pageContent: split.pageContent, metadata: {
        ...split.metadata,
        source: {
          page: split.metadata.page , // Assuming page number is available in metadata
          line: split.metadata.line || 1 // Default line number, adjust as necessary
        }
      } }))
    );
    const stats :any= await index.describeIndexStats();
    const namespaceStats = stats.namespaces[pdfFile.name] || { vectorCount: 0 };

    const cookies = request.cookies; // Access cookies here
    const userSession = cookies.get("user"); // Example of getting a specific cookie

    const usercookie = JSON.parse(userSession!.value); // Replace with the actual user email or get it from the request
    const user = await Users.findOne({ name: usercookie.name });
    const filter = { name: usercookie.name };

    if (user) {
      // Check if the namespace already exists
      if (!user.namespaces) {
        user.namespaces = [pdfFile.name];
        // update the value of the 'quantity' field to 5
        const updateDocument = {
          $set: {
            namespaces: [pdfFile.name],
          },
        };
        const result = await Users.updateOne(filter, updateDocument);

        console.log(result);
      } else {
        const namespaceExists = user.namespaces.includes(pdfFile.name); // Check if the file name already exists

        if (namespaceExists) {
          return NextResponse.json({ message: "Namespace already exists." }, { status: 400 }); // Send response if it exists
        } else {
          const pdfName=pdfFile!.name
          const results = await Users.updateOne(
            { name: usercookie.name },
            { $addToSet: { namespaces: [pdfName] } }
          );
          console.log(results);
          
        }
      }
    }

    return NextResponse.json({
      message: "PDF processed and uploaded to vector store successfully",
      filename: pdfFile.name,
      namespace: pdfFile.name,
      vectorCount: namespaceStats.vectorCount,
      totalDocuments: docs.length,
      totalChunks: allSplits.length,
    });

    // code to add namespace object with value pdfFile.name in Users collection
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
