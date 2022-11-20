import {FailedElement, LoadingElement, proportion, Unique} from "./common";
import ReactECharts from "echarts-for-react";
import {CrawlApi} from "../api";


export default function LangDistribution(props: { platform: string, handle: string[] }): JSX.Element {
    const {platform} = props;
    const handle = Unique(props.handle);
    if (handle.length === 0) {
        return <FailedElement platform={platform}/>;
    }
    const data = handle.map((h) => {
        const resp = CrawlApi('GetUserSubmitRecord', {platform: platform, handle: h});
        return {
            handle: h,
            data: resp,
        };
    });
    for (const d of data) {
        if (d.data === undefined) {
            return <LoadingElement/>;
        }
        if (d.data === null) {
            if (platform === 'vjudge') {
                return <FailedElement platform={platform} name={d.handle} msg="未正确配置/网络错误/ID错误"/>
            }
            return <FailedElement platform={platform} name={d.handle}/>;
        }
    }
    const langDict = new Map<string, number>();
    const langMap = new Map<string, Map<string, number>>();
    const countMap = new Map<string, number>();
    for (const d of data) {
        const map = new Map<string, number>();
        langMap.set(d.handle, map);
        countMap.set(d.handle, 0);
        const record = d.data?.submitRecordData || []
        for (const r of record) {
            const lang = r?.programmingLanguage;
            if (lang) {
                if (langDict.get(lang) === undefined) {
                    langDict.set(lang, langDict.size);
                }
                map.set(lang, (map.get(lang) || 0) + 1);
                countMap.set(d.handle, (countMap.get(d.handle) || 0) + 1);
            }
        }
    }
    const radiusData: string[] = [];
    const allLang: string[] = new Array(langDict.size);
    langDict.forEach((i, lang) => {
        console.log(`${lang} - ${i}`)
        allLang[i] = lang;
    });
    const series: any[] = [];
    for (let i = 0; i < langDict.size; i += 1) {
        const s = {
            type: 'bar',
            data: new Array<number>(),
            coordinateSystem: 'polar',
            name: allLang[i],
            stack: 'a',
            emphasis: {
                focus: 'series',
            },
        };
        for (let j = 0; j < handle.length; j += 1) {
            s.data.push(0);
        }
        series.push(s);
    }
    (() => {
        let index = 0;
        langMap.forEach((map, key) => {
            radiusData.push(key);
            for (let i = 0; i < langDict.size; i += 1) {
                series[index].data.push(0);
            }
            map.forEach((value, lang) => {
                console.log(`${key}: ${lang}=${value}`);
                series[langDict.get(lang) as number].data[index] = value / (countMap.get(key) || 0);
            });
            index += 1;
        });
    })();
    const option = {
        angleAxis: {},
        radiusAxis: {
            type: 'category',
            data: radiusData,
            z: 10
        },
        polar: {},
        series: series,
        legend: {
            show: true,
            data: allLang,
        },
    };
    console.log(option);
    return <ReactECharts style={{
        width: '100%',
        height: `calc(100vh * ${proportion})`,
    }} option={option}/>;
}