/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import Users from "@/dbconfig/dbconfig";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies; // Access cookies here
    const userSession = cookies.get("user"); // Example of getting a specific cookie
    console.log(userSession);

    const usercookie = JSON.parse(userSession!.value); // Replace with the actual user email or get it from the request
    const user = await Users.findOne({ name: usercookie.name });

    // Initialize Pinecone client
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Connect to the Pinecone index
    const index = pc.Index(process.env.PINECONE_INDEX!);

    // Retrieve the list of namespaces
    const stats: any = await index.describeIndexStats();
    const namespaces = Object.keys(stats.namespaces);
console.log(stats,namespaces,user!.namespaces,'hajha');

    return NextResponse.json({
     namespaces: user!.namespaces,
    });
  } catch (error) {
    console.error("Error retrieving namespaces:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
