import {Button, Calendar as SemiCalendar, Spin, Typography} from '@douyinfe/semi-ui';
import {CrawlApi, JumpLink} from "./api";
import {EventObject} from '@douyinfe/semi-foundation/lib/es/calendar/foundation';
import {IconClose, IconTickCircle} from "@douyinfe/semi-icons";
import {useState} from "react";

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
    const weekStartOn: any = new Date().getDay(); // 今天作为每周第一天
    return (
        <div>
            <SemiCalendar style={{overflow: "hidden"}} height="100%" mode="week" events={events}
                          weekStartsOn={weekStartOn}/>
        </div>
    );
}

const SimpleOnlineJudgeName = new Map<string, string>([
    ['codeforces', 'CF'],
    ['nowcoder', '牛客'],
    ['atcoder', 'ATC'],
    ['leetcode', '力扣'],
    ['acwing', "ACW"],
    ['luogu', '洛谷'],
]);

function RecentContestLoadingPage(platforms: string[]): JSX.Element {
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
        marginBottom: '25px',
        fontSize: '22px'
    };
    const FailedElement = () => {
        return <></>;
        // return failed > 0 ? (
        //     <div style={messageStyle}>某些平台爬取失败了，你可以选择重新爬取。</div>
        // ) : <></>;
    };
    const AllSuccessElement = () => {
        return allSuccess ? (
            <div style={messageStyle}>
                所有平台的最近比赛都爬取成功了，接下来为你画出最近一周的比赛日历。
            </div>
        ) : <></>;
    }
    return (
        <>
            <div style={{
                margin: 'auto',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                display: 'inline',
            }}>
                {
                    recentContest.map((value, index) => {
                        let simple = SimpleOnlineJudgeName.get(value?.platform || '');
                        simple = simple || value?.platform || '';
                        if (value?.response === null) {
                            return (
                                <span style={{
                                    marginRight: index + 1 === platforms.length ? '0' : '150px',
                                    display: 'inline-block',
                                    transform: 'scale(4)',
                                    color: '#e01313',
                                }}>
                                <IconClose/>
                                <div style={{
                                    fontSize: '7px',
                                }}>{simple}</div>
                            </span>
                            );
                        } else if (value?.response) {
                            return (
                                <span style={{
                                    marginRight: index + 1 === platforms.length ? '0' : '150px',
                                    display: 'inline-block',
                                    transform: 'scale(4)',
                                    color: '#159e22',
                                }}>
                                <IconTickCircle/>
                                <div style={{
                                    fontSize: '7px',
                                }}>{simple}</div>
                            </span>
                            );
                        }
                        return (
                            <Spin size="large" key={index} style={{
                                transform: 'scale(2)',
                                marginRight: index + 1 === platforms.length ? '0' : '100px',
                            }} tip={simple}>
                            </Spin>
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
                    allSuccess ? <></> : (
                        <Button size="large" style={{
                            transform: 'scale(1.2)',
                        }} theme='solid' type='secondary' onClick={() => {
                            setForce(true);
                        }}>强制渲染</Button>
                    )
                }
            </div>
        </>
    );
}

export default function Calendar(): JSX.Element {
    return RecentContestLoadingPage(['nowcoder', 'acwing', 'leetcode', 'codeforces', 'luogu', 'acwing']);
}