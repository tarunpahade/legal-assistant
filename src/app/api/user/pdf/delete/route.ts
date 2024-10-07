
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';

export async function DELETE(request: NextRequest) { // Changed from GET to DELETE
  try {
    const { searchParams } = new URL(request.url); // Extract search parameters from the request URL
    const encodedNamespace: string | null = searchParams.get('name'); // Get the 'name' parameter

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
    const index = pc.Index(process.env.PINECONE_INDEX!);

    // Delete the specified namespace
    const stats: any = await index._deleteOne(namespace);
    console.log(stats);

    return NextResponse.json({
      message: "Namespace deleted successfully" // Updated response message
    });
  } catch (error) {
    console.error("Error deleting namespace:", error); // Updated error log message
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}