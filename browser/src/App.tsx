import { useState, useRef, useEffect } from "react";


export default function App() {
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")
    const inputRef = useRef<HTMLInputElement>()

    function fixUrl(urlRaw: string) {
        if (!urlRaw.startsWith("https://")) urlRaw = "https://" + urlRaw;
        return urlRaw
    }

    function loadUrl() {
        const rawUrl = inputRef.current?.value
        setUrl(fixUrl(rawUrl))
    }

    useEffect(() => {
        console.log(url)
        url&&window.location.assign(url)
    }, [url])

    return <div className="min-h-[100vh] bg-black/10 flex items-center justify-center flex-col p-5 gap-2">
        <div className="text-3xl my-5">
            Anti-Sus Browser
        </div>
        <input placeholder="Enter a URL you want to visit" className="p-2 px-3 text-black outline-none rounded-xl bg-transparent border border-black/30 placeholder-black/30 w-full mx-10"
            ref={inputRef}
            onKeyDown={e => {
                if (e.key == "Enter") {
                    let urlRaw: string = e.target.value;
                    setUrl((fixUrl(urlRaw)))
                }
            }}
        />
        <button className="bg-green-300 text-black p-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={loadUrl}
        >GO</button>
    </div>
}
