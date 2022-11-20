import {CSSProperties, useState} from "react";
import ContestLineGraph from "../graph/contest_line";
import {deepCopy} from "deep-copy-ts";
import {Button, Select} from "@douyinfe/semi-ui";
import {SearchFollower} from "../api";
import LangDistribution from "../graph/lang_distribution";
import {FrontEndJump} from "../util/jump";

const padding = 10;

function Graph(props: { elements?: JSX.Element[] }): JSX.Element {
    const {elements} = props;
    const [width, setWidth] = useState(document.body.clientWidth);
    window.addEventListener('resize', () => {
        setWidth(document.body.clientWidth);
    });
    const space = 10;
    const empty = padding * 2.5;
    const CanInOneRow = (blk: number): boolean => {
        return width - empty >= 900 * blk + space * (blk + 1);
    };
    let block = 1;
    if (CanInOneRow(2)) {
        block = 2;
    }
    const perWidth = (width - empty - space * (block + 1)) / block;
    const SpaceElement = () => {
        return <div style={{width: space, height: 1, float: 'left'}}/>;
    };
    const baseBlockStyle = {
        width: perWidth,
        float: 'left',
    };
    let cur = 0;
    const Row = () => {
        return (
            <div style={{
                display: 'inline-block',
                marginTop: 20,
            }} key={cur}>
                <SpaceElement/>
                {
                    (() => {
                        const r = [];
                        for (let i = 0; i < block; i += 1) {
                            const copyBaseBlockStyle = deepCopy(baseBlockStyle);
                            if (elements && cur < elements.length) {
                                r.push(
                                    <div key={2 * i} style={Object.assign(copyBaseBlockStyle)}>
                                        {elements[cur]}
                                    </div>
                                );
                                cur += 1;
                            } else {
                                r.push(
                                    <div key={2 * i} style={Object.assign(copyBaseBlockStyle, {
                                        height: 200,
                                        // backgroundColor: "#EEE",
                                    }) as CSSProperties}/>
                                );
                            }
                            r.push(
                                <SpaceElement key={2 * i + 1}/>
                            );
                        }
                        return r;
                    })()
                }
            </div>
        );
    };
    const ret: JSX.Element[] = [];
    while (elements && cur < elements.length) {
        ret.push(Row());
    }
    return (
        <div style={{
            marginTop: 20,
        }}>{ret}</div>
    );
}

let selectedCache: any = undefined;

export default function Compare(props: {}): JSX.Element {
    const follower: any[] | undefined = SearchFollower();
    // const [selected, setSelected] = useState<any[]>([]);
    const selected: (string | number)[] = (() => {
        const urlParam = new URLSearchParams(window.location.search);
        return JSON.parse(urlParam.get('sub_page') || '[]');
    })();
    const setSelected = (selected: (string | number)[]): void => {
        const urlParam = new URLSearchParams(window.location.search);
        urlParam.set('sub_page', JSON.stringify(selected));
        FrontEndJump(urlParam);
    };
    const selectedInfo: any[] | undefined = SearchFollower({fid: selected});
    const platforms: string[] = ['codeforces', 'nowcoder', 'atcoder', 'luogu', 'leetcode', 'vjudge'];
    const info = new Map<string, string[]>();
    for (const platform of platforms) {
        info.set(platform, []);
    }
    selectedInfo?.forEach((value) => {
        if (!value) {
            return;
        }
        const push = (key: string) => {
            const v = value[`${key}_id`];
            if (v) {
                info.get(key)?.push(v);
            }
        };
        for (const platform of platforms) {
            push(platform);
        }
    });
    const elements: JSX.Element[] = [];
    // codeforces line
    if (info.get('codeforces')?.length) {
        elements.push(<ContestLineGraph platform="codeforces" handle={info.get('codeforces') || []}/>);
    }
    // nowcoder line
    if (info.get('nowcoder')?.length) {
        elements.push(<ContestLineGraph platform="nowcoder" handle={info.get('nowcoder') || []}/>);
    }
    // atcoder line
    if (info.get('atcoder')?.length) {
        elements.push(<ContestLineGraph platform="atcoder" handle={info.get('atcoder') || []}/>);
    }
    // leetcode line
    if (info.get('leetcode')?.length) {
        elements.push(<ContestLineGraph platform="leetcode" handle={info.get('leetcode') || []}/>);
    }
    // codeforces language distribution
    if (info.get('codeforces')?.length) {
        elements.push(<LangDistribution platform="codeforces" handle={info.get('codeforces') || []}/>);
    }
    // vjudge language distribution
    if (info.get('vjudge')?.length) {
        elements.push(<LangDistribution platform="vjudge" handle={info.get('vjudge') || []}/>);
    }
    return (
        <div style={{
            padding: padding,
        }}>
            <div>
                <div>
                    选择你要关注的人
                </div>
                <Select multiple style={{width: 'calc(100% - 120px)'}} onChange={(v) => {
                    selectedCache = v;
                }} defaultValue={selected}>
                    {
                        follower?.map((value, index) => {
                            return (
                                <Select.Option key={index} value={value.id}>{value.name}</Select.Option>
                            );
                        })
                    }
                </Select>
                <Button style={{
                    marginLeft: 10,
                }} theme="solid" type="primary" onClick={() => {
                    setSelected(deepCopy(selectedCache || selected));
                }}>确认</Button>
            </div>
            <Graph elements={elements}/>
        </div>
    );
}