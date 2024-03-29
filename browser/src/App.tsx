import { useState, useRef, useEffect } from "react";
import Chat from "./chat";
import Domstat from "./domstat"
import { PiRobotFill } from "react-icons/pi";
import { MdAssuredWorkload } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios"



export default function App() {
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [curl, setCurl] = useState("")
    const [isSus, setIsSus] = useState(false)
    const [chatOpen, setChatOpen] = useState(false)
    const [domOpen, setDomOpen] = useState(false)
    const [summary, setSummary] = useState("")
    const [stats, setStats] = useState({})

    const inputRef = useRef<HTMLInputElement>()

    function fixUrl(urlRaw: string) {
        if (urlRaw.startsWith("http://")) urlRaw.replace("http://", "https://")
        else if (!urlRaw.startsWith("https://")) urlRaw = "https://" + urlRaw;
        return urlRaw
    }

    function loadUrl() {
        setSummary("")
        const rawUrl = inputRef.current?.value
        setUrl(fixUrl(rawUrl))
        window.ipcRenderer.openUrl(url)

    }

    useEffect(() => {
        if (!url) return
        console.log(url)
        const whois = "https://api.api-ninjas.com/v1/whois?domain="
        const domainFixed = url.replace("https://", "").replace("http://", "").replace("://", "")
        axios.get(whois + domainFixed, { headers: { "X-api-key": "XO1iqd3CLYl3dSoQO/dKSw==rt3bXWIlb0PYjQ4h" } })
            .then(r =>{
                console.log(r.data)
                setStats(r.data)
            })
        // url&&window.location.assign(url)
        // ipcRenderer.invoke("openUrl", url)
        window.ipcRenderer.openUrl(url)
    }, [url])

    function loadSummary() {
        window.ipcRenderer.loadSumm()
    }

    window.ipcRenderer.on('urlUpdated', (_event, message) => {
        setCurl(message)
        console.log(message)
    })

    window.ipcRenderer.on('isSus', (_event, message) => {
        // console.log(message)
        setIsSus(message)
    })

    window.ipcRenderer.on('summary', (_event, message) => {
        // console.log(message)
        setSummary(message.join(" "))
    })



    return <div className="min-h-[100vh] bg-black/10 flex text-center items-center justify-between flex-col p-2 gap-2 rounded-xl">
        <button className="absolute top-1 right-1 cursor-pointer" onClick={() => setChatOpen(!chatOpen)}><PiRobotFill size={28} className="transition-all duration-200 hover:scale-105 active:scale-95" /></button>
        <button className="absolute top-8 right-1 cursor-pointer" onClick={() => loadSummary()}><MdAssuredWorkload size={28} className="transition-all duration-200 hover:scale-105 active:scale-95" /></button>
        <button className="absolute top-16 right-1 cursor-pointer" onClick={() => setDomOpen(!domOpen)}><FaInfoCircle size={28} className="transition-all duration-200 hover:scale-105 active:scale-95" /></button>
        <div className="text-3xl">
            AntiSus Browser
            <div className="text-black/50 text-sm font-mono">
                {curl}
            </div>
        </div>
        {!chatOpen && !domOpen ? <>
            {isSus ? <> <div className="font-bold text-red-500 text-xl animate-pulse bg-yellow-400 w-full rounded-lg p-2">
                SUSPICIOUS ACTIVITY<br />DETECTED 📢🚨
            </div>
                {/* <div className="text-left overflow-scroll max-h-[110px] scroll border border-black/30 p-1 -m-1 rounded-lg"> */}
                {/*     <div>  1. Dark pattern in terms and conditions</div> */}
                {/* </div> */}
            </> : <div className="text-black/30">No sus activity yet</div>}
            <div className="h-[110px] overflow-scroll scroll">{summary}</div>
            <div className="flex gap-2 justify-evenly w-full">
                <input placeholder="Enter a URL to visit" className="p-2 px-3 grow w-full text-black outline-none rounded-xl bg-transparent border border-black/30 placeholder-black/30"
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
        </> : <>
            {domOpen ? <Domstat stats={stats} /> :
                <Chat />}

        </>}
    </div>
}
