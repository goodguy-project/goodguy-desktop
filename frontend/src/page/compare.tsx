import {CSSProperties, useState} from "react";
import ContestLineGraph from "../graph/contest_line";
import {deepCopy} from "deep-copy-ts";
import {Button, Select} from "@douyinfe/semi-ui";
import LangDistribution from "../graph/lang_distribution";
import {SearchFollower, SetPageInfo} from "../../wailsjs/go/main/App";
import {core, main, model} from "../../wailsjs/go/models";
import PageInfo = main.PageInfo;
import SearchFollowerRequest = core.SearchFollowerRequest;
import Follower = model.Follower;
import {LogError} from "../../wailsjs/runtime";
import Loading from "./loading";

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

export default function Compare(props: {pageInfo: PageInfo}): JSX.Element {
    const {pageInfo} = props;
    const selected: number[] = (() => {
        const fid = pageInfo?.compare?.fid;
        return fid || [];
    })();
    const [selectedInfo, setSelectedInfo] = useState<Array<Follower> | undefined>(undefined);
    const [follower, setFollower] = useState<Array<Follower> | undefined>(undefined);
    if (selectedInfo === undefined && follower === undefined) {
        if (selected.length === 0) {
            setTimeout(() => {
                setSelectedInfo([]);
            }, 0);
        } else {
            SearchFollower(new SearchFollowerRequest({
                'id': selected,
            })).then((value) => {
                setSelectedInfo(value);
            }).catch((err) => {
                LogError(err.toString());
            });
        }
        SearchFollower(new SearchFollowerRequest({})).then((value) => {
            setFollower(value);
        }).catch((err) => {
            LogError(err.toString());
        });
    }
    if (selectedInfo === undefined || follower === undefined) {
        return <Loading/>;
    }
    const setSelected = (selected: (string | number)[]): void => {
        const fid: number[] = [];
        for (const x of selected) {
            if (typeof x === 'number') {
                fid.push(x);
            } else {
                fid.push(parseInt(x));
            }
        }
        SetPageInfo(new PageInfo({
            page: 'compare',
            compare: {
                fid: fid,
            },
        })).then(() => {
        });
    };
    type ComparePlatform = 'codeforces' | 'nowcoder' | 'atcoder' | 'luogu' | 'leetcode' | 'vjudge';
    const platforms: ComparePlatform[] = ['codeforces', 'nowcoder', 'atcoder', 'luogu', 'leetcode', 'vjudge'];
    const info = new Map<string, string[]>();
    for (const platform of platforms) {
        info.set(platform, []);
    }
    selectedInfo?.forEach((value) => {
        if (!value) {
            return;
        }
        const push = (key: ComparePlatform) => {
            let v: string;
            if (key === 'codeforces') {
                v = value.codeforces_id;
            } else if (key === 'nowcoder') {
                v = value.nowcoder_id;
            } else if (key === 'atcoder') {
                v = value.atcoder_id;
            } else if (key === 'luogu') {
                v = value.luogu_id;
            } else if (key === 'leetcode') {
                v = value.leetcode_id;
            } else if (key === 'vjudge') {
                v = value.vjudge_id;
            } else {
                const k: never = key;
                v = `${k}${k}`;
            }
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