import Image from "next/image";

interface ExampleImageProps {
  src: string;
  alt: string;
}

export function ExampleImage({ src, alt }: ExampleImageProps) {
  return (
    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground relative">
      <Image src={src} alt={alt} width={100} height={100} />
      <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
} 