import fs from "node:fs";
import path from "node:path";
import { pipeline, RawImage } from '@huggingface/transformers';

const assetsPath = path.join(process.cwd(), 'public/assets');

// Functional directory traversal
const transverse = (dirPath) => async (f) => {
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
            await transverse(filePath)(f);
        } else {
            await f(filePath);
        }
    }
};

/**
 * Local Depth Estimation using ONNX Runtime
 */
const getDepthMapLocal = async (depthEstimator, fileBuffer) => {
    try {
        // Convert Buffer to RawImage for Transformers.js
        const image = await RawImage.fromBlob(new Blob([fileBuffer]));

        // Run inference
        const result = await depthEstimator(image);

        /**
         * The result returns 'predicted_depth' as a RawImage.
         * We convert this to a PNG Buffer.
         */
        const outputImage = result.depth;
        return outputImage

    } catch (error) {
        console.error("Local Inference Error:", error);
        throw error;
    }
};

// Main Execution
(async () => {
    console.log("Initializing...");
    
    // Allocate the pipeline once outside the loop to keep the model in memory
    const depthEstimator = await pipeline(
        'depth-estimation', 
        './models/depth-model'
    );

    await transverse(assetsPath)(async (filePath) => {
        const parent = path.dirname(filePath);
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);

        // Filter for albedo images
        if (!baseName.endsWith("-albedo")) return;

        const depthName = baseName.slice(0, -7) + "-depth" + ext;
        const depthPath = path.join(parent, depthName);

        // Skip if depth map already exists
        if (fs.existsSync(depthPath)) {
            console.log(`Skipping existing: ${depthName}`);
            return;
        }

        console.log(`Processing: ${baseName}${ext}`);
        
        try {
            const buffer = fs.readFileSync(filePath);
            const depthBuffer = await getDepthMapLocal(depthEstimator, buffer);

            depthBuffer.save(depthPath)
            console.log("Successfully saved:", depthPath);
        } catch (err) {
            console.error(`Failed to process ${filePath}:`, err.message);
        }
    });

    console.log("All tasks finished.");
})();