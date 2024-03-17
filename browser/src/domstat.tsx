
export default function Domstat(props:any) {
    console.log(props.stats)

    return <div className="flex flex-col text-center h-[300px] items-center justify-center grow overflow-scroll scroll">
        <div className="text-xl">Domain Stats</div>
        <div>Domain: {props.stats.domain_name!}</div>
        <div>Country: {props.stats.country!}</div>
        <div>Org: {props.stats.org!}</div>
        <div>State: {props.stats.state!}</div>

        <div>Emails: {props.stats.emails!.join(", ")}</div>
        <div>Nameservers: {props.stats.name_servers!.join(", ")}</div>

        <div>Whois Server: {props.stats.whois_server!}</div>
    </div>
}
