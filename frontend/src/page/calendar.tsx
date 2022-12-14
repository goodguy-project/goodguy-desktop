import {Button, Calendar as SemiCalendar, Spin, Typography} from '@douyinfe/semi-ui';
import {CleanCrawlCache, CrawlApi, JumpLink} from "../api";
import {EventObject} from '@douyinfe/semi-foundation/lib/es/calendar/foundation';
import {IconClose, IconTickCircle} from "@douyinfe/semi-icons";
import {Dispatch, useState} from "react";
import {Page} from "./page";

function DoShowCalendar(recentContest: any[]): JSX.Element {
    const {Numeral} = Typography;
    const events: EventObject[] = [];
    recentContest?.forEach((contests: any) => {
        const platform = contests?.platform || '';
        contests?.recentContest?.forEach((contest: any) => {
            // console.log(contest);
            const url = contest?.url || undefined;
            const name = contest?.name || '';
            const startTime = Number(contest?.timestamp) || 0;
            const endTime = startTime + (Number(contest?.duration) || 0);
            const content = `[${platform}] ${name}`;
            const event = {
                key: String(events.length),
                start: new Date(startTime * 1000),
                end: new Date(endTime * 1000),
                children: (
                    <div style={{
                        borderRadius: '3px',
                        boxSizing: 'border-box',
                        border: 'var(--semi-color-primary) 1px solid',
                        padding: '3px',
                        backgroundColor: 'var(--semi-color-primary-light-default)',
                        height: '100%',
                        overflow: 'hidden',
                    }}>
                        {
                            url ? (
                                <Numeral onClick={() => {
                                    if (url) {
                                        JumpLink(url).then(() => {
                                        });
                                    }
                                }} style={{cursor: 'pointer'}}>{content}</Numeral>
                            ) : <Numeral>{content}</Numeral>
                        }
                    </div>
                ),
            };
            events.push(event);
        });
    });
    const weekStartOn: any = new Date().getDay(); // ???????????????????????????
    return (
        <div>
            <SemiCalendar style={{overflow: "hidden"}} height="100%" mode="week" events={events}
                          weekStartsOn={weekStartOn}/>
        </div>
    );
}

function RecentContestLoadingPage(props: {platforms: string[], setPage: Dispatch<Page>}): JSX.Element {
    const {platforms, setPage} = props;
    const [force, setForce] = useState(false);
    const [ready, setReady] = useState(false);
    const recentContest = [];
    let success = 0, failed = 0;
    for (const platform of platforms) {
        const response = CrawlApi('GetRecentContest', {platform: platform});
        recentContest.push({platform: platform, response: response});
        if (response !== undefined && response !== null) {
            success += 1;
        } else if (response === null) {
            failed += 1;
        }
    }
    const allSuccess = platforms.length === success;
    if (ready && !allSuccess) {
        setReady(false);
    }
    // ready to paint calendar
    if (force || (ready && allSuccess)) {
        return DoShowCalendar(recentContest.map((value) => {
            return value?.response || [];
        }));
    }
    if (!ready && allSuccess) {
        setTimeout(() => {
            setReady(true);
        }, 1000);
    }
    const messageStyle = {
        marginBottom: '47px',
        fontSize: '22px',
    };
    const FailedElement = () => {
        return failed > 0 ? (
            <div style={messageStyle}>????????????????????????????????????????????????????????????</div>
        ) : <></>;
    };
    const AllSuccessElement = () => {
        return allSuccess ? (
            <div style={messageStyle}>
                ???????????????????????????????????????????????????????????????????????????????????????????????????
            </div>
        ) : <></>;
    };
    return (
        <>
            <div style={{
                margin: 'auto',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                display: 'flex',
            }}>
                {
                    recentContest.map((value, index) => {
                        const platform = value?.platform || '';
                        if (value?.response === null) {
                            return (
                                <span style={{
                                    marginRight: index + 1 === platforms.length ? '0' : '180px',
                                    display: 'inline-block',
                                    transform: 'scale(4)',
                                    color: '#e01313',
                                }}>
                                    <IconClose/>
                                    <div style={{
                                        fontSize: '7px',
                                    }}>{platform}</div>
                                </span>
                            );
                        } else if (value?.response) {
                            return (
                                <span style={{
                                    marginRight: index + 1 === platforms.length ? '0' : '180px',
                                    display: 'inline-block',
                                    transform: 'scale(4)',
                                    color: '#159e22',
                                }}>
                                    <IconTickCircle/>
                                    <div style={{
                                        fontSize: '7px',
                                    }}>{platform}</div>
                                </span>
                            );
                        }
                        return (
                            <span style={{
                                transform: 'scale(2.0)',
                                marginRight: index + 1 === platforms.length ? '0' : '150px',
                                display: 'inline-block',
                            }}>
                                <Spin size="large" key={index}/>
                                <div style={{
                                    fontSize: '14px',
                                }}>{platform}</div>
                            </span>
                        );
                    }).map((value, index) => {
                        return <span key={index}>{value}</span>;
                    })
                }
            </div>
            <div style={{
                margin: 'auto',
                position: 'absolute',
                left: '50%',
                top: '65%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                display: 'inline',
            }}>
                <AllSuccessElement/>
                <FailedElement/>
                {
                    failed > 0 ? (
                        <Button size="large" style={{
                            transform: 'scale(1.2)',
                            marginRight: 70,
                        }} theme="solid" type="tertiary" onClick={() => {
                            CleanCrawlCache().then(()=>{
                                setPage('calendar');
                            });
                        }}>????????????</Button>
                    ) : <></>
                }
                {
                    allSuccess ? <></> : (
                        <Button size="large" style={{
                            transform: 'scale(1.2)',
                        }} theme="solid" type="secondary" onClick={() => {
                            setForce(true);
                        }}>????????????</Button>
                    )
                }
            </div>
        </>
    );
}

export default function Calendar(props: {setPage: Dispatch<Page>}): JSX.Element {
    return RecentContestLoadingPage({
        platforms: ['nowcoder', 'acwing', 'leetcode', 'codeforces', 'luogu', 'acwing'],
        setPage: props.setPage,
    });
}