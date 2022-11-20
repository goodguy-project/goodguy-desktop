import ReactECharts from 'echarts-for-react';
import {GetAtcoderRatingColor, GetCodeforcesRatingColor, GetNowcoderRatingColor} from "../util/color";
import {CrawlApi} from "../api";
import {renderToString} from "react-dom/server";
import {FailedElement, LoadingElement, proportion, Unique} from "./common";

function getLineGraphBackgroundData(platform: string) {
    let ratings: number[] = [];
    let getColor = (_: number) => {
        return "";
    };
    if (platform === 'codeforces') {
        ratings = [1200, 1400, 1600, 1900, 2100, 2400, 3000, 5000];
        getColor = GetCodeforcesRatingColor;
    } else if (platform === 'nowcoder') {
        ratings = [700, 1200, 1500, 2200, 2800, 4000];
        getColor = GetNowcoderRatingColor;
    } else if (platform === 'atcoder') {
        ratings = [400, 800, 1200, 1600, 2000, 2400, 2800, 5000];
        getColor = GetAtcoderRatingColor;
    } else {
        return [[], []];
    }
    const colorData = [];
    const markLineData = [];
    let pre = 0;
    for (const x of ratings) {
        colorData.push([
            {
                yAxis: pre,
                itemStyle: {
                    color: getColor(pre),
                    opacity: 0.6,
                }
            },
            {
                yAxis: x
            },
        ]);
        markLineData.push({
            yAxis: x,
            lineStyle: {
                color: getColor(x),
            },
            label: {
                color: getColor(x),
            },
        });
        pre = x;
    }
    return [colorData, markLineData];
}

export default function ContestLineGraph(props: { platform: string, handle: string[] }): JSX.Element {
    const {platform} = props;
    const handle = Unique(props.handle);
    if (handle.length === 0) {
        return <FailedElement platform={platform}/>;
    }
    const data = handle.map((h) => {
        const resp = CrawlApi('GetUserContestRecord', {
            platform: platform,
            handle: h,
        });
        // console.log(resp);
        if (resp === undefined || resp === null) {
            return {
                handle: h,
                data: resp,
            };
        }
        return {
            handle: h,
            data: resp?.record?.map((value: any) => {
                const date = new Date(parseInt(value?.timestamp || '0') * 1000.0);
                return [
                    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                    value?.rating || 0,
                    value?.rating || 0,
                    value?.name || '',
                    value?.url || '',
                ];
            }),
        };
    });
    for (const d of data) {
        if (d.data === undefined) {
            return <LoadingElement/>;
        }
        if (d.data === null) {
            return <FailedElement platform={platform} name={d?.handle}/>;
        }
    }
    const [colorData, markLineData] = getLineGraphBackgroundData(platform);
    const series = data.map((value) => {
        return {
            lineStyle: {
                color: 'gold',
                shadowColor: 'white',
                shadowBlur: 1
            },
            itemStyle: {
                color: 'gold',
                shadowColor: 'white',
                shadowBlur: 1
            },
            name: value.handle,
            type: 'line',
            data: value.data,
            encode: {
                x: 0,
                y: 1,
            },
            markPoint: {
                symbol: 'circle',
                symbolSize: 10,
                silent: true,
                data: [
                    {
                        type: 'max',
                        label: {
                            position: 'top',
                            textBorderWidth: 5,
                        }
                    },
                ],
            },
            markArea: {
                silent: true,
                data: colorData,
            },
            markLine: {
                silent: true,
                symbol: 'none',
                label: {
                    position: 'start',
                },
                lineStyle: {
                    type: 'solid',
                    width: 0,
                },
                data: markLineData,
            },
        };
    });
    const option = {
        title: {
            text: `contest/${platform}`,
            // link: "user_info_url",
        },
        legend: {},
        toolbox: {
            feature: {
                saveAsImage: {
                    name: `[${platform}](${handle.join('-')})`,
                    pixelRatio: 2,
                }
            }
        },
        grid: [
            {
                show: true,
                // left: '20%',
            }
        ],
        xAxis: [
            {
                type: 'time',
                splitNumber: 13,
                gridIndex: 0
            }
        ],
        yAxis: [
            {
                show: false,
                scale: true,
                gridIndex: 0
            },
        ],
        series: series,
        tooltip: {
            backgroundColor: '#222',
            borderColor: '#777',
            formatter: function (obj: any) {
                const value = obj.value;
                // console.log(obj);
                return renderToString(
                    <div style={{
                        fontSize: '18px',
                    }}>
                        {obj.seriesName}
                        <br/>
                        {value[3]}
                        <br/>
                        rating: {value[1]}
                    </div>
                );
            },
            position: 'right',
        },
        dataZoom: {
            type: 'slider'
        }
    };
    return <ReactECharts style={{
        width: '100%',
        height: `calc(100vh * ${proportion})`,
    }} option={option}/>;
}