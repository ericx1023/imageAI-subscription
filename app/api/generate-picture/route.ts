import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
    const { userId, modelId, modelName } = await req.json();
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN
    });
    const output = await replicate.run(
        `ericx1023/${modelName}:${modelId}`,
        {
          input: {
            model: "dev",
            prompt: `${modelName} is wearing a cozy Christmas sweater, standing by the fireplace with stockings and holiday decorations.`,
            go_fast: false,
            lora_scale: 1,
            megapixels: "1",
            num_outputs: 5,
            aspect_ratio: "1:1",
            output_format: "jpg",
            guidance_scale: 3,
            output_quality: 90,
            prompt_strength: 0.8,
            extra_lora_scale: 1,
            num_inference_steps: 28
          }
        }
      ) as string[];
      const images = await Promise.all(
        output.map(async (imageUrl: string) => {
          const res = await fetch(imageUrl);
          const arrayBuffer = await res.arrayBuffer();
          return Buffer.from(arrayBuffer).toString('base64');
        })
      );
      return NextResponse.json(images);
          
}