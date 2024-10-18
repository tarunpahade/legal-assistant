import { NextRequest, NextResponse } from "next/server";
import Users from "@/dbconfig/dbconfig";
import { SignUp } from "@/types/interface";

export async function POST(request: NextRequest) {
  try {
    const reqBody: SignUp = await request.json();

    const { name } = reqBody;
    console.log(reqBody);
    
    const user1 = await Users.findOne({ name });
    if (user1) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const savedUser = await Users.insertOne(reqBody);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
