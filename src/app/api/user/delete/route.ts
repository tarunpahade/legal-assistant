/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(request: NextRequest) { // Changed from DELETE to POST
  try {
    const { name: encodedNamespace } = await request.json(); // Extract 'name' from the request body

    if (!encodedNamespace) {
      return NextResponse.json({ error: "Namespace name is required" }, { status: 400 });
    }

    const namespace: string = decodeURIComponent(encodedNamespace); // Decode the namespace
    console.log(`Deleting namespace: ${namespace}`);

    // Initialize Pinecone client
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Connect to the Pinecone index
    const index = pc.index(process.env.PINECONE_INDEX!);



    const deleteResponse: any = await index.namespace(namespace).deleteAll();
    // Call the delete method
    console.log(deleteResponse); // Log the response from the delete operation


    return NextResponse.json({
      message: "Namespace deleted successfully" ,
      deleteResponse,
      // Updated response message
    });
  } catch (error) {
    console.error("Error deleting namespace:", error); // Updated error log message
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}