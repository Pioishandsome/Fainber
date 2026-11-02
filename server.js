const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fabric Finder server running on port ${PORT}`);
});


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

app.use(express.static(__dirname));


app.post("/api/recommend", async (req, res) => {

    console.log("Fabric recommendation request received!");


    try {

        const {
            style,
            season,
            purpose,
            additional
        } = req.body;



        if (
            typeof style !== "string" ||
            !style.trim() ||

            typeof season !== "string" ||
            !season.trim() ||

            typeof purpose !== "string" ||
            !purpose.trim()
        ) {

            return res.status(400).json({
                error: "Please enter style, season, and purpose."
            });

        }


        const extraRequirements =
            typeof additional === "string"
                ? additional.trim()
                : "";



        // ===================================
        // OpenAI Recommendation
        // ===================================

        const response = await openai.responses.create({

            model: "gpt-6-luna",


            instructions: `
You are Fabric Finder, an expert fabric recommendation assistant.

Recommend one suitable fabric based on the user's style, season, purpose, and additional requirements.

IMPORTANT OUTPUT FORMAT:

Start your answer with exactly:

Recommended fabric: [Specific fabric name]

Then leave a blank line and provide these four sections.

1. Why this fabric is suitable
Explain why the fabric matches the user's style, season, and purpose.

2. Important properties
Explain important characteristics such as weight, texture, breathability, stretch, durability, water resistance, drape, or warmth when relevant.

3. Limitations
Explain disadvantages, weaknesses, or things the user should consider.

4. Other useful information
Give practical information such as suitable garment types, finishes, care, or alternatives when useful.

IMPORTANT:
- Put each section on its own paragraph.
- Leave one blank line between sections.
- Keep the answer clear and easy to read.
- Use a specific and recognizable fabric name.
- Do not put unnecessary explanations in the fabric name.
- Do not use markdown tables.
            `,


            input: `
Style: ${style.trim()}

Season: ${season.trim()}

Purpose: ${purpose.trim()}

Additional Requirements: ${extraRequirements || "None"}
            `,


            max_output_tokens: 800

        });



        // ===================================
        // Get AI Response
        // ===================================

        const recommendation = response.output_text;


        console.log("FULL AI RESPONSE:");
        console.log(recommendation);



        // ===================================
        // Send Result to Frontend
        // ===================================

        res.json({

            recommendation: recommendation

        });


    } catch (error) {

        console.error("Server error:", error);

        res.status(500).json({

            error: "Failed to generate fabric recommendation."

        });

    }

});


// ===================================
// Start Server
// ===================================

app.listen(PORT, () => {

    console.log(
        `Fabric Finder server running on port ${PORT}`
    );

});