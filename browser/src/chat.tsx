import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown'
import { FiLoader } from "react-icons/fi";



const genAI = new GoogleGenerativeAI("AIzaSyBvSswhwR0HD6LfgHLsjGHxtjw7Rgq5wro");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default function Chat() {
    const [gemini_data, setGemini_data] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [fetch_gemini_data, setFetch_gemini_data] = useState("");

    const handleInput3 = (event) => {
        const name = event.target.name;
        // console.log(event.target.value);
        const value = event.target.value;
        console.log(name, value);
        if (name == "gem") setGemini_data(value);
    };

    async function fetchDataFromGemini() {
        try {
            setLoading(true)
            setFetch_gemini_data("");
            const prompt = gemini_data;
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log(text);
            setLoading(false);
            setFetch_gemini_data(text);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }
    return <div className="flex flex-col items-center justify-center grow">
        <div className="text-xl">Security Chatbot</div>
        <div className="text-sm text-black/50 mb-5">Ask away your questions related to security</div>

        <div className="flex flex-col gap-2 rounded-2xl items-center justify-center">
            <div className="flex flex-row gap-2">
                <input
                    placeholder="Text"
                    type="text"
                    autoComplete="off"
                    value={gemini_data}
                    onChange={handleInput3}
                    name="gem"
                    id="gem"
                    className="p-2 rounded-md border border-black/30 outline-none"
                ></input>

                <button
                    className="border border-black/30 bg-green-300 hover:scale-105 active:scale-95 transition-all duration-200 px-3 rounded-md font-bold text-lg"
                    onClick={fetchDataFromGemini}
                >
                    GO
                </button>

            </div>
            <div className="overflow-scroll scroll  break-all">
                {loading?<FiLoader size={26} className="animate-spin"/>:""}
                <Markdown>{fetch_gemini_data}
                </Markdown>
            </div>
        </div>
    </div>
}
