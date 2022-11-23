import {Button, Form, Modal, Popover, Spin, Table as SemiTable, Typography} from "@douyinfe/semi-ui";
import {CrawlApi, FollowerApi, JumpLink, LoadFollower, SearchFollower} from "../api";
import {Dispatch, useState} from "react";
import Column from "@douyinfe/semi-ui/lib/es/table/Column";
import {deepCopy} from "deep-copy-ts";
import {Page} from "./page";
import {IconAlertCircle} from "@douyinfe/semi-icons";
import {FrontEndJump} from "../util/jump";
import {GetAtcoderRatingColor, GetCodeforcesRatingColor, GetNowcoderRatingColor} from "../util/color";

const {Numeral} = Typography;

type SubPage = { page: 'table' | 'manager', param?: any };

function ManagerFollower(props: { fid?: number, setPage: Dispatch<Page>, setSubPage: Dispatch<SubPage> }): JSX.Element {
    const {fid, setPage, setSubPage} = props;
    const [follower, setFollower] = useState<any>(null);
    if (fid && !follower) {
        FollowerApi('search', {fid: fid}).then((resp) => {
            if (resp?.length) {
                setFollower(resp[0]);
            }
        });
        return <Spin size="middle"/>;
    }
    return (
        <div style={{
            margin: 'auto',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            // textAlign: 'center',
        }}>
            <Form render={({formState, formApi, values}) => {
                return (
                    <>
                        <Form.Input initValue={follower?.name || ''} field="name" label="昵称" style={{width: 200}}
                                    rules={[{required: true, message: '昵称必填'}]} trigger={['blur', 'custom']}/>
                        <Form.Input initValue={follower?.codeforces_id || ''} field="codeforces_id"
                                    label="Codeforces ID"
                                    style={{width: 200}}/>
                        <Form.Input initValue={follower?.atcoder_id || ''} field="atcoder_id" label="AtCoder ID"
                                    style={{width: 200}}/>
                        <Form.Input initValue={follower?.nowcoder_id || ''} field="nowcoder_id" label="NowCoder ID"
                                    style={{width: 200}}/>
                        <Form.Input initValue={follower?.luogu_id || ''} field="luogu_id" label="Luogu ID"
                                    style={{width: 200}}/>
                        <Form.Input initValue={follower?.vjudge_id || ''} field="vjudge_id" label="VJudge ID"
                                    style={{width: 200}}/>
                        <Form.Input initValue={follower?.leetcode_id || ''} field="leetcode_id" label="LeetCode ID"
                                    style={{width: 200}}/>
                        <Button style={{marginRight: 8}} onClick={() => {
                            formApi.validate().then(() => {
                                if (follower) {
                                    const form = deepCopy(formState);
                                    form.values.fid = fid;
                                    FollowerApi('update', form.values).then(() => {
                                        console.log('update ok');
                                        setPage('follower');
                                    }).catch((err) => {
                                        alert(err);
                                    });
                                } else {
                                    FollowerApi('add', formState.values).then(() => {
                                        console.log('add ok');
                                        setPage('follower');
                                    }).catch((err) => {
                                        alert(err);
                                    });
                                }
                            }).catch(() => {
                            });
                        }}>确认</Button>
                        <Button onClick={() => {
                            setSubPage({page: 'table'});
                        }}>取消</Button>
                    </>
                );
            }}
                // onValueChange={values => console.log(values)}
            />
        </div>
    );
}

function CellLoading(): JSX.Element {
    return <Spin/>;
}

function NowcoderRatingElement(props: { handle: string, rating: number }): JSX.Element {
    const {handle, rating} = props;
    return (
        <Numeral style={{color: GetNowcoderRatingColor(rating), cursor: 'pointer'}} onClick={() => {
            JumpLink(`https://www.nowcoder.com/users/${encodeURI(handle)}`).then(() => {
            });
        }}>
            <b>{rating}</b>
        </Numeral>
    );
}

function CodeforcesRatingElement(props: { handle: string, rating: number }): JSX.Element {
    const {handle, rating} = props;
    return (
        <Numeral style={{color: GetCodeforcesRatingColor(rating), cursor: 'pointer'}} onClick={() => {
            JumpLink(`https://codeforces.com/profile/${encodeURI(handle)}`).then(() => {
            });
        }}>
            <b>{rating}</b>
        </Numeral>
    );
}

function AtCoderRatingElement(props: { handle: string, rating: number }): JSX.Element {
    const {handle, rating} = props;
    return (
        <Numeral style={{color: GetAtcoderRatingColor(rating), cursor: 'pointer'}} onClick={() => {
            JumpLink(`https://atcoder.jp/users/${encodeURI(handle)}`).then(() => {
            });
        }}>
            <b>{rating}</b>
        </Numeral>
    );
}

function RatingElement(props: { platform: string, handle: string }): JSX.Element {
    const {platform, handle} = props;
    if (!handle) {
        return <></>;
    }
    const resp = CrawlApi('GetUserContestRecord', {platform: platform, handle: handle});
    const CrawlFailedElement = () => {
        return (
            <Popover content={
                <article style={{padding: 12}}>
                    网络错误或ID错误
                </article>
            }>
                <IconAlertCircle style={{
                    transform: 'scale(1.5)'
                }}/>
            </Popover>
        );
    };
    if (resp === null) {
        return <CrawlFailedElement/>;
    }
    if (resp) {
        const rating = resp?.rating;
        if (rating) {
            if (platform === 'codeforces') {
                return <CodeforcesRatingElement handle={handle} rating={rating}/>;
            } else if (platform === 'nowcoder') {
                return <NowcoderRatingElement handle={handle} rating={rating}/>;
            } else if (platform === 'atcoder') {
                return <AtCoderRatingElement handle={handle} rating={rating}/>;
            }
        } else {
            return <CrawlFailedElement/>;
        }
        return <b>{rating}</b>;
    }
    return <CellLoading/>;
}

function Table(props: { setSubPage: Dispatch<SubPage> }): JSX.Element {
    const {setSubPage} = props;
    const follower = SearchFollower({});
    const data = follower?.map((v: any, index: number) => {
        return {
            key: (index + 1).toString(),
            fid: v?.id || null,
            name: v?.name || ' ',
            codeforces_id: v?.codeforces_id || '',
            atcoder_id: v?.atcoder_id || '',
            nowcoder_id: v?.nowcoder_id || '',
            luogu_id: v?.luogu_id || '',
            vjudge_id: v?.vjudge_id || '',
            leetcode_id: v?.leetcode_id || '',
        };
    });
    const HandlerElement = (props: { handle: any, profileUrl?: string }) => {
        const {handle, profileUrl} = props;
        if (typeof handle !== 'string' || !handle) {
            return <></>;
        }
        const TextElement = (props: { text: string }) => {
            return <>{props.text}</>;
        };
        if (!profileUrl) {
            return <Numeral><TextElement text={handle}/></Numeral>;
        }
        return (
            <Numeral style={{cursor: 'pointer'}} onClick={() => {
                JumpLink(profileUrl).then(() => {
                });
            }}><TextElement text={handle}/>
            </Numeral>
        );
    };
    return (
        <>
            <SemiTable dataSource={data} pagination={false}>
                <Column title="昵称" dataIndex="name"/>
                <Column title="Codeforces ID" dataIndex="codeforces_id" render={(text) => {
                    return <HandlerElement handle={text}
                                           profileUrl={`https://codeforces.com/profile/${encodeURI(text)}`}/>;
                }}/>
                <Column title="Codeforces Rating" render={(text, record, index) => {
                    return <RatingElement platform="codeforces" handle={record?.codeforces_id || ''}/>;
                }}/>
                <Column title="AtCoder ID" dataIndex="atcoder_id" render={(text) => {
                    return <HandlerElement handle={text}
                                           profileUrl={`https://atcoder.jp/users/${encodeURI(text)}`}/>;
                }}/>
                <Column title="AtCoder Rating" render={(text, record) => {
                    return <RatingElement platform="atcoder" handle={record?.atcoder_id || ''}/>;
                }}/>
                <Column title="NowCoder ID" dataIndex="nowcoder_id" render={(text) => {
                    return <HandlerElement handle={text}
                                           profileUrl={`https://www.nowcoder.com/users/${encodeURI(text)}`}/>;
                }}/>
                <Column title="NowCoder Rating" render={(text, record) => {
                    return <RatingElement platform="nowcoder" handle={record?.nowcoder_id || ''}/>;
                }}/>
                <Column title="Luogu ID" dataIndex="luogu_id" render={(text) => {
                    return <HandlerElement handle={text} profileUrl={undefined}/>;
                }}/>
                <Column title="Vjudge ID" dataIndex="vjudge_id" render={(text) => {
                    return <HandlerElement handle={text} profileUrl={`https://vjudge.net/user/${encodeURI(text)}`}/>;
                }}/>
                <Column title="LeetCode ID" dataIndex="leetcode_id" render={(text) => {
                    return <HandlerElement handle={text} profileUrl={`https://leetcode.cn/u/${text}/`}/>;
                }}/>
                <Column title="LeetCode Rating" render={(text, record) => {
                    return <RatingElement platform="leetcode" handle={record?.leetcode_id || ''}/>;
                }}/>
                <Column title="操作" render={(text, record) => {
                    const fid = record?.fid;
                    if (fid) {
                        return (
                            <>
                                <Button style={{marginRight: 8}} onClick={() => {
                                    setSubPage({page: 'manager', param: {fid: fid}});
                                }}>修改</Button>
                                <Button onClick={() => {
                                    Modal.confirm({
                                        title: '是否删除', onOk: () => {
                                            FollowerApi('delete', {fid: fid}).then(() => {
                                                setSubPage({page: 'table'});
                                            });
                                        }
                                    });
                                }}>删除</Button>
                            </>
                        );
                    }
                    return <></>;
                }}/>
            </SemiTable>
        </>
    );
}

export default function Follower(props: { setPage: Dispatch<Page> }): JSX.Element {
    const {setPage} = props;
    // const [subPage, setSubPage] = useState<SubPage>({page: 'table'});
    const subPage: SubPage = (JSON.parse(new URLSearchParams(window.location.search).get('sub_page') || '{"page":"table"}') || {page: 'table'}) as SubPage;
    const setSubPage = (subPage: SubPage): void => {
        const urlParam = new URLSearchParams(window.location.search);
        urlParam.set('sub_page', JSON.stringify(subPage));
        FrontEndJump(urlParam);
    };
    if (subPage.page === 'manager') {
        const fid = subPage.param?.fid || undefined;
        return <ManagerFollower setPage={setPage} setSubPage={setSubPage} fid={fid}/>;
    }
    const AddFollowerBtn = () => {
        return <Button onClick={() => {
            setSubPage({page: 'manager'});
        }}>新增关注者</Button>;
    };
    const SaveFollowerBtn = () => {
        return <Button style={{
            marginLeft: 10,
        }} onClick={() => {
            FollowerApi('search').then((value) => {
                const {SaveFile} = (window as any).app;
                SaveFile('follower.json', JSON.stringify(value)).then((value: any) => {
                    if (value) {
                        Modal.success({
                            title: '导出成功',
                            content: `导出位置：${value}`,
                        });
                    }
                }).catch((e: any) => {
                    alert(e);
                });
            });
        }}>导出关注者</Button>;
    };
    const LoadFollowerBtn = () => {
        return <Button style={{
            marginLeft: 10,
        }} onClick={() => {
            const {SelectFile} = (window as any).app;
            SelectFile({
                filters: [
                    {name: 'json file', extensions: ['json']},
                ],
            }).then((value: string | null) => {
                Modal.confirm({
                    title: '确定导入',
                    content: '导入关注者会导致原有数据丢失，是否要导入？',
                    onOk() {
                        if (value) {
                            LoadFollower(value).then(() => {
                                setPage('follower');
                            });
                        }
                    },
                });
            });
        }}>导入关注者</Button>;
    };
    return (
        <>
            <div style={{
                margin: 10,
            }}>
                <AddFollowerBtn/>
                <SaveFollowerBtn/>
                <LoadFollowerBtn/>
            </div>
            <Table setSubPage={setSubPage}/>
        </>
    );
}