import { PromptProps } from "./types/prompts";

export const MODEL_PROMPTS = {
    headshot: "headshot of smiling model posing with a lot of cute puppies wearing casual clothes posing for dating app headshot. indoor blurry background. the lighting is warm, possibly from a setting sun, creating a soft glow around him, enhancing the casual and relaxed vibe of the image. the setting seems to be outdoors, likely in an urban environment, with the blurred background hinting at a street or park-like area. this image likely portrays a youthful, active, and approachable individual, possibly in a lifestyle or fashion-related context.",
    restaurant: "pov photo of model seated at restaurant table across from camera, in romantic upscale setting facing camera. medium rare steak is on the table sliced into several pieces, on a wooden board, which also has a small dish of what appears to be a side condiment or salsa with chopped vegetables.",
    professional: "professional headshot of smiling model wearing professional clothes posing for headshot. blurry indoor office background. The overall vibe of the image is one of professionalism, likely intended for a formal or business-related setting, such as a corporate headshot or a professional profile picture.",
    catwalk: "model as fashion model in fashion shoot on catwalk. Hasselblad photography.",
    streetStyle: "model as fashion model in street style shoot with diverse outfits. Hasselblad photography.",
    beach: "fit model on the beach, playing volleyball, seemingly in preparation for a serve. model appears focused, with their gaze fixed on the ball. the background includes other beachgoers and beach equipment, but they are slightly blurred, emphasizing the model as the focal point. the model has a muscular build, with defined arms, chest, and abs. the volleyball holding is a mikasa brand, commonly used in beach volleyball. the setting suggests a warm, sunny day, perfect for beach activities.",
    privateJet: "beautiful influencer instagram model wearing elegant clothes sitting in private jet cabin, with leather interior, luxurious. champagne is on the table. outside is clouds because we are flying.",
} as const;

export function getBeachPrompt(props: PromptProps): string {
    const attire = props.photoType === 'male' 
        ? 'shirtless' 
        : props.photoType === 'female'
        ? 'wearing bikini' 
        : 'wearing long swim shorts';
    
    return `the photo shows a fit, ${attire} ${MODEL_PROMPTS.beach}`;
} 

