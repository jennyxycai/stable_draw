import { useState } from "react";

const samplePrompts = ["A sleek purple outdoor bicycle against a cityscape background.",
"High-tech running shoes with futuristic design elements.",
"Elegant wristwatch with intricate detailing, reminiscent of a Rolex.",
"A cozy, modern armchair in a minimalist living room setting.",
"A set of professional chef's knives displayed on a wooden cutting board.",
"A sophisticated, high-end laptop with a sleek, metallic finish."]

import sample from "lodash/sample";

export default function PromptForm(props) {
  const [prompt] = useState(sample(samplePrompts));
  const [image, setImage] = useState(null);

  return (
    <form
      onSubmit={props.onSubmit}
      className="py-5 animate-in fade-in duration-700"
    >
      <div className="flex max-w-[512px]">
        <input
          type="text"
          defaultValue={prompt}
          name="prompt"
          placeholder="Enter a prompt..."
          className="block w-full flex-grow rounded-l-md"
        />

        <button
          className="bg-black text-white rounded-r-md text-small inline-block px-3 flex-none"
          type="submit"
        >
          Generate
        </button>
      </div>
    </form>
  );
}
