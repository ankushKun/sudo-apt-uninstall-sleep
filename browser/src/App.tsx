import { useState, useRef, useEffect } from "react";


export default function App() {
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [curl, setCurl] = useState("")
    const [isSus, setIsSus] = useState(false)

    const inputRef = useRef<HTMLInputElement>()

    function fixUrl(urlRaw: string) {
        if (!urlRaw.startsWith("https://")) urlRaw = "https://" + urlRaw;
        return urlRaw
    }

    function loadUrl() {
        const rawUrl = inputRef.current?.value
        setUrl(fixUrl(rawUrl))
        window.ipcRenderer.openUrl(url)

    }

    useEffect(() => {
        if (!url) return
        console.log(url)
        // url&&window.location.assign(url)
        // ipcRenderer.invoke("openUrl", url)
        window.ipcRenderer.openUrl(url)
    }, [url])

    window.ipcRenderer.on('urlUpdated', (_event, message) => {
        setCurl(message)
        console.log(message)
    })

    window.ipcRenderer.on('isSus', (_event, message)=>{
        // console.log(message)
        setIsSus(message)
    })


    return <div className="min-h-[100vh] bg-black/10 flex text-center items-center justify-between flex-col p-2 gap-2 rounded-xl">
        <div className="text-3xl">
            Anti-Sus Browser
            <div className="text-black/50 text-sm font-mono">
                {curl}
            </div>
        </div>
        {isSus ? <div className="font-bold text-red-500 text-3xl animate-pulse bg-yellow-400 w-full rounded-lg p-2">
            SUS <br />DETECTED<br />📢🚨
        </div>:<div className="text-black/30">No sus activity yet</div>}
        <div className="flex gap-2 justify-evenly w-full">
            <input placeholder="Enter a URL you want to visit" className="p-2 px-3 grow w-full text-black outline-none rounded-xl bg-transparent border border-black/30 placeholder-black/30"
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
    </div>
}
