import {FailedElement, LoadingElement, proportion, Unique} from "./common";
import ReactECharts from "echarts-for-react";
import {CrawlApi} from "../interact";
import {proto} from "../../wailsjs/go/models";
import GetSubmitRecordResponse = proto.GetSubmitRecordResponse;

const ProtoLangMap = new Map<number, string>([
    [0, "Unknown"],
    [1, "Cpp"],
    [2, "Java"],
    [3, "Python"],
    [4, "Golang"],
    [5, "C"],
    [6, "CSharp"],
    [7, "Kotlin"],
    [8, "JavaScript"],
    [9, "TypeScript"],
    [10, "Lua"],
    [11, "ObjectiveC"],
    [12, "Swift"],
    [13, "Rust"],
    [14, "Scala"],
    [15, "Pascal"],
    [16, "Haskell"],
    [17, "Ruby"],
    [18, "PHP"],
    [19, "Erlang"],
    [20, "Elixir"],
    [21, "Racket"],
]);

export default function LangDistribution(props: { platform: string, handle: string[] }): JSX.Element {
    const {platform} = props;
    const handle = Unique(props.handle);
    if (handle.length === 0) {
        return <FailedElement platform={platform}/>;
    }
    const data = handle.map((h) => {
        const resp: GetSubmitRecordResponse | undefined | null = CrawlApi('GetSubmitRecord', {
            platform: platform,
            handle: h
        });
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
        const record = d.data?.submit_record || []
        for (const r of record) {
            const langIndex = r?.programming_language;
            const lang = ProtoLangMap.get(langIndex === undefined ? -1 : langIndex);
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
    return <ReactECharts style={{
        width: '100%',
        height: `calc(100vh * ${proportion})`,
    }} option={option}/>;
}