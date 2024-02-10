import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-[512px] mx-auto p-10 bg-white rounded-lg">

      <div className="text-left mb-5">
        <h1 className="text-5xl font-bold text-orange-500">Design your World</h1>
      </div>


      <div className="flex justify-center items-center h-[desired-height]">
  <p className="text-orange-500 text-xl font-extrabold  decoration-2 underline-offset-2 text-center pb-5">
    <strong>We are redefining shopping through accessible image interfaces.</strong>
  </p>
</div>

      <p className="pb-5 text-lg">
        Build items for your environment from scratch with our generative tools.
      </p>

      <p className="pb-5 text-lg">
        This is the <strong> Next-Generation </strong> of design tools.
      </p>
      

      <ol className="list-decimal pl-5">
        <li className="mb-2">
          Select a mode to develop an image. Enter a text prompt, and sketch an outline of your desired image to begin.
        </li>
        <li className="mb-2">
          Make thematic changes or generative edits through natural language and inpainting.  
        </li>

      </ol>

      <Link href="/paint">
        <a className="py-3 block text-center bg-black text-white rounded-md mt-10">
          Design now!
        </a>
      </Link>
    </div>
  );
}
