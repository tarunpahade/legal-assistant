/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';

export async function GET(request: NextRequest) {
  try {
    console.log(request);
    
    // Initialize Pinecone client
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Connect to the Pinecone index
    const index = pc.Index(process.env.PINECONE_INDEX!);

    // Retrieve the list of namespaces
    const stats: any = await index.describeIndexStats();
    const namespaces = Object.keys(stats.namespaces);
console.log(stats,namespaces);

    return NextResponse.json({
      namespaces,
    });
  } catch (error) {
    console.error("Error retrieving namespaces:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
