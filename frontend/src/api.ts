import axios from "axios";
import {useEffect, useState} from "react";

const urlParams = new URLSearchParams(window.location.search);

const host = urlParams.get('host') || '127.0.0.1';
const port = urlParams.get('port') || 43497;
const server = `http://${host}:${port}`;
console.log(`server: ${server}`);

export function CrawlApi(func: string, param?: any) {
    param = param || {};
    const [resp, setResp] = useState<any>(undefined);
    useEffect(() => {
        axios.post(`${server}/crawl/${func}`, param).then((r) => {
            if (r.status === 200) {
                setTimeout(() => {
                    setResp({data: r.data});
                }, 0);
            } else {
                setResp(null);
                // alert('unknown error');
            }
        }).catch((e) => {
            setResp(null);
            // alert(e);
        });
    }, [func, JSON.stringify(param)]);
    // return null when failed
    if (resp === undefined || resp === null) {
        return resp;
    }
    return resp?.data;
}

export function SearchFollower(param?: any) {
    param = param || {};
    const [resp, setResp] = useState<any>(undefined);
    useEffect(() => {
        axios.post(`${server}/follower/search`, param).then((r) => {
            if (r.status === 200) {
                setResp({data: r.data});
            }
        }).catch((e) => {
            alert(e);
        });
    }, [JSON.stringify(param)]);
    return resp?.data?.data;
}

export async function FollowerApi(op: string, param?: any) {
    param = param || {};
    const resp = await axios.post(`${server}/follower/${op}`, param);
    if (resp.status !== 200) {
        console.log(resp);
    }
    return resp.data?.data;
}

export async function JumpLink(link: string) {
    const resp = await axios.post(`${server}/jump`, {link: link});
    if (resp.status !== 200) {
        console.log(resp);
    }
    return resp.data;
}

export function GetCrawlSetting() {
    const [resp, setResp] = useState<any>(undefined);
    useEffect(() => {
        axios.post(`${server}/crawl/get-setting`).then((r) => {
            if (r.status === 200) {
                setTimeout(() => {
                    setResp({data: r.data});
                }, 0);
            }
        }).catch((e) => {
            alert(e);
        });
    }, []);
    return resp?.data?.data;
}

export async function UpdateCrawlSetting(data: any) {
    const resp = await axios.post(`${server}/crawl/update-setting`, data);
    if (resp.status !== 200) {
        console.log(resp);
    }
    return resp.data;
}

export async function LoadFollower(filename: string) {
    try {
        await axios.post(`${server}/follower/load`, {
            filename: filename,
        });
    } catch (e) {
        alert(e);
    }
}

export async function CleanCrawlCache() {
    return await axios.post(`${server}/crawl/clean-cache`);
}