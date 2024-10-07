/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";


import { Pinecone } from '@pinecone-database/pinecone';



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdfFile') as File | null;
console.log(pdfFile,'lala');

    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 });
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
const indexList:any = await pc.listIndexes();
const indexExists = indexList.indexes.some((index:any) => index.name === process.env.PINECONE_INDEX);

if (!indexExists) {
  await pc.createIndex({
    name: process.env.PINECONE_INDEX!,
    dimension: 1536,
    metric: 'cosine',
    spec: { 
      serverless: { 
        cloud: 'aws', 
        region: 'us-east-1' 
      }
    } 
  }); 
  console.log('Created Index Successfully');
} else {
  console.log('Index already exists');
}

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index,
  namespace: pdfFile.name,
  textKey: 'text',
});

// Upsert the embedded documents into Pinecone
await vectorStore.addVectors(
  embeddedDocuments,
  allSplits.map(split => ({ pageContent: split.pageContent, metadata: split.metadata }))
);
const stats :any= await index.describeIndexStats();
const namespaceStats = stats.namespaces[pdfFile.name] || { vectorCount: 0 };

return NextResponse.json({
  message: "PDF processed and uploaded to vector store successfully",
  filename: pdfFile.name,
  namespace: pdfFile.name,
  vectorCount: namespaceStats.vectorCount,
  totalDocuments: docs.length,
  totalChunks: allSplits.length,
});

} catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}