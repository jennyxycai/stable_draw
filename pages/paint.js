import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Dropzone from "components/dropzone";
import Download from "components/download";
import { XCircle as StartOverIcon } from "lucide-react";
import { Lightbulb, Code as CodeIcon } from "lucide-react";
import { Rocket as RocketIcon } from "lucide-react";
import MyButtonGroup from "components/selector";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";

// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
    const [predictions, setPredictions] = useState([]);
    const [error, setError] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [userUploadedImage, setUserUploadedImage] = useState(null);
    const [selected, setSelected] = useState(1);
    const [finalURL, setFinalUrl] = useState(null);
    const [tipMsg, setTipMsg] = useState(null);

    console.log(predictions, error, maskImage == null, userUploadedImage == null, selected);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const prevPrediction = predictions[predictions.length - 1];
        const prevPredictionOutput = prevPrediction?.output ? prevPrediction.output[prevPrediction.output.length - 1] : null;

        var body;
        var img = userUploadedImage? await resizeImageBlob(userUploadedImage, 512, 512) : null
        if (selected == 1) {
            body = {
                prompt: e.target.prompt.value,
                image: img
                    ? await readAsDataURL(img)
                    : // only use previous prediction as init image if there's a mask
                    maskImage
                    ? prevPredictionOutput
                    : null,
                mask: maskImage,
                invert_mask: true,
                selected: 1,
                
            };
        } else if (selected == 2) {
            body = {
                prompt: e.target.prompt.value,
                image: maskImage,
                selected: 2,
            };
        } else if (img) {
            body = {
                prompt: e.target.prompt.value,
                image: await readAsDataURL(img),
                selected: 0,
            };
        }

        console.log(body);

        const response = await fetch("/api/predictions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const prediction = await response.json();

        if (response.status !== 201) {
            setError(prediction.detail);
            return;
        }
        setPredictions(predictions.concat([prediction]));

        while (prediction.status !== "succeeded" && prediction.status !== "failed") {
            await sleep(1000);
            const response = await fetch("/api/predictions/" + prediction.id);
            prediction = await response.json();
            if (response.status !== 200) {
                setError(prediction.detail);
                return;
            }
            setPredictions(predictions.concat([prediction]));
            console.log(prediction);
            if (prediction.status === "succeeded") {
                console.log(prediction);
                var blob = await imageUrlToBlob(prediction.output[prediction.output.length - 1]);
                console.log(blob);
                setUserUploadedImage(blob);
                setFinalUrl(prediction.output[prediction.output.length - 1]);
                setTipMsg(null);
            }
        }
    };

    function imageUrlToBlob(imageUrl) {
      return fetch(imageUrl)
          .then((response) => {
              // Check if the fetch was successful
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              // Convert the response to a blob
              return response.blob();
          })
          .catch((e) => {
              console.error("There was a problem fetching the image:", e);
              throw e; // Re-throw the error for further handling
          });
  }
  
  function resizeImageBlob(blob, width, height) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, blob.type);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}


    const select_reset = async () => {
        setPredictions([]);
        setError(null);
        setMaskImage(null);
        setUserUploadedImage(null);
        setFinalUrl(null);
        setTipMsg(null);
    };

    const non_sketch_reset = async () => {
        setMaskImage(null);
        setTipMsg(null);
    };

    const startOver = async (e) => {
        e.preventDefault();
        setPredictions([]);
        setError(null);
        setMaskImage(null);
        setUserUploadedImage(null);
        setSelected(0);
        setFinalUrl(null);
        setTipMsg(null);
    };

    const router = useRouter();

    const handleButtonClick = () => {
        router.push({
            pathname: "/shop", // The path to the new page
            query: { finalURL }, // Passing the finalUrl as a query parameter
        });
    };

    const processError = (err) => {
      if (err == "The specified version does not exist (or perhaps you don't have permission to use it?)")
        return "Ensure you entered all parameters. You cannot make edits without previously generating or uploading an image.";
      else
        return "Diffusion models failed — " + err
      };
      
    return (
        <div>
            <Head>
                <title>ShopVisual</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div style={{ marginTop: "30px" }}></div>
            <div className="max-w-[512px] mx-auto relative h-7">
                <MyButtonGroup selected={selected} setSelected={setSelected} select_reset={select_reset} non_sketch_reset={non_sketch_reset}></MyButtonGroup>
            </div>
            <main className="container mx-auto p-5">
                {error && (
                    <div className="max-w-[512px] mx-auto mb-3">
                        <Alert severity="error">Error: {processError(error)}</Alert>
                    </div>
                )}

                <div className="border-hairline max-w-[512px] mx-auto relative ">
                    {selected != 2 && (
                        <div className="border-hairline max-w-[512px] mx-auto relative">
                            <Dropzone onImageDropped={setUserUploadedImage} predictions={predictions} userUploadedImage={userUploadedImage} selected = {selected}/>
                            <div
                                className="bg-gray-50 relative max-h-[512px] w-full flex items-stretch"
                                // style={{ height: 0, paddingBottom: "100%" }}
                            >
                                <Canvas predictions={predictions} userUploadedImage={userUploadedImage} onDraw={setMaskImage} select={selected} />
                            </div>
                        </div>
                    )}
                    <div
                        className={`bg-gray-50 relative max-h-[512px] w-full flex items-stretch `}
                        // Conditionally apply height based on 'selected' value
                    >
                        {selected == 2 && <Canvas predictions={predictions} userUploadedImage={userUploadedImage} onDraw={setMaskImage} select={selected} />}
                    </div>
                </div>

                <div className="max-w-[512px] mx-auto">
                    <PromptForm onSubmit={handleSubmit} />

                    {finalURL && (
                        <div className = "mb-3" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: "green", color: "white", textTransform: "none", boxShadow: "none" }} // Add textTransform style here
                                    endIcon={<ShoppingCartIcon />}
                                    onClick={handleButtonClick}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    )}
                    {tipMsg && (
                        <div className="max-w-[512px] mx-auto">
                            <Alert severity="info">{tipMsg}</Alert>
                        </div>
                    )}

                    <div className="text-center ">
                        {((predictions.length > 0 && predictions[predictions.length - 1].output) || maskImage || userUploadedImage) && (
                            <button className="lil-button" onClick={startOver}>
                                <StartOverIcon className="icon" />
                                Start over
                            </button>
                        )}

                        <Download predictions={predictions} />
                    </div>
                </div>
            </main>
        </div>
    );
}

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = () => {
            resolve(fr.result);
        };
        fr.readAsDataURL(file);
    });
}
