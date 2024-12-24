import { NextResponse } from "next/server";
import { userCreate } from "@/utils/data/user/userCreate";
import { currentUser } from "@clerk/nextjs/server";
const TestPage = async () => {
    const data = await currentUser()
    console.log(data)   
    await userCreate({
        email: data?.emailAddresses?.[0]?.emailAddress!,
        first_name: data?.firstName!,
        last_name: data?.lastName!,
        profile_image_url: data?.imageUrl!,
        user_id: data?.id!,
      });
      console.log('User created successfully');

    console.log(NextResponse.json({
        status: 200,
        message: "User info inserted",
      }));

      
  return <div>
    <div>
      {JSON.stringify(NextResponse.json({
        status: 200,
        message: "User info inserted",
      }))}
    </div>
  </div>
}

export default TestPage