import { VasariLogo } from "./icons";
import Image from "next/image";
import { ArtFrameCanvasDynamic } from "./frame/dynamic.component";

export default function HeroComponent() {

    return (<>
        <div className="relative px-20 pt-24 pb-12 w-full">
            <div className="text-center ">
                <h1 className="text-4xl font-bold md:text-6xl mb-4">Your Artwork Is Missing</h1>
                <p className="text-base md:text-lg">
                    Preserve the Story and Significance of Your Artwork with Vasari.
                    Don&apos;t Let the Real Art Be Lost in the Digital World.
                </p>
            </div>

            {/* Branding Section */}
            <div className="flex justify-center items-center mt-8 mb-12 grayscale">
                <div className="flex items-center space-x-1">
                    <VasariLogo size={22} />
                    <span className="font-bold">Vasari</span>
                </div>

                <span className="mx-2">|</span>

                <div className="flex items-center space-x-1">
                    <Image src="/solanaLogo.png" alt="Solana" priority width={100} height={42} />
                </div>
            </div>

            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                display: 'flex',
            }}>
                <ArtFrameCanvasDynamic heightMargin={0.2} maxWidth={13} widthMargin={0.4}></ArtFrameCanvasDynamic>
            </div>
        </div>
    </>);

}