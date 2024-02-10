const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";
const addBackgroundToPNG = require("lib/add-background-to-png");


export default async function handler(req, res) {
  // remnove null and undefined values
  req.body = Object.entries(req.body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );

  if (req.body.mask) {
    req.body.mask = addBackgroundToPNG(req.body.mask);
    
  }


  let vers;
  console.log("HERE IS BODY" + req.body)
  if (req.body.selected === 2)
    vers  = "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117" 
  else if (req.body.selected ==1 && req.body.mask )
    vers= "e490d072a34a94a11e9711ed5a6ba621c3fab884eda1665d9d3a282d65a21180" // ST "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
  else if (req.body.selected ==1)
    vers= "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
  else if (req.body.selected == 0)
   vers = "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f"
  else if (req.body.selected  == 3)
    vers = "aca001c8b137114d5e594c68f7084ae6d82f364758aab8d997b233e8ef3c4d93"

  const body = JSON.stringify({
    // Pinned to a specific version of Stable Diffusion, fetched from:
    // https://replicate.com/stability-ai/stable-diffusion
    version: vers,
    input: req.body,
  });

  console.log(body)

  const response = await fetch(`${API_HOST}/v1/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body,
  });

  console.log(response)

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '5mb' // Set desired value here
      }
  }
}

function encodeImageToBase64(imageBuffer) {
  return Buffer.from(imageBuffer).toString('base64');
}

async function invertImage(base64Image) {
  try {
    const response = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });
    const data = await response.json();
    if (data.image) {
      return data.image;
    } else {
      throw new Error('No image returned from server');
    }
  } catch (error) {
    console.error('Error inverting image:', error);
    throw error;
  }
}