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
    <strong>Redefine the design process.</strong>
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
          Select which mode to use for developing an image. You may generate an image from an existing image, or via a sketch outline of your desired object. Enter a text prompt, and then hit Generate!
        </li>
        <li className="mb-2">
          Continue to make generative edits through natural language requests.  
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
