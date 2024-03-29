import {Button, Col, Form, Modal, Row, Typography} from "@douyinfe/semi-ui";
import Loading from "./loading";
import {CleanCrawlCache, GetCrawlSetting, SetPageInfo, UpdateCrawlSetting} from "../../wailsjs/go/main/App";
import {core, main} from "../../wailsjs/go/models";
import {useState} from "react";
import CrawlSetting = core.CrawlSetting;
import {deepCopy} from "deep-copy-ts";
import PageInfo = main.PageInfo;

const {Text} = Typography;

export default function Setting(props: {}): JSX.Element {
    const {Section, Input} = Form;
    const [crawlSetting, setCrawlSetting] = useState<CrawlSetting | undefined>(undefined);
    if (crawlSetting === undefined) {
        GetCrawlSetting().then((setting) => {
            setCrawlSetting(setting);
        });
        return <Loading/>;
    }
    let formData: any = undefined;
    return (
        <div style={{
            padding: 10,
        }}>
            <Form onValueChange={(data) => {
                formData = deepCopy(data);
            }}>
                <Section text="vjudge爬虫">
                    <Row>
                        <Col span={8}>
                            <Input field="crawlVjudgeUsername" label="vjudge用户名"
                                   initValue={crawlSetting?.vjudge?.username || ''}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Input field="crawlVjudgePassword" label="vjudge密码" type="password"
                                   initValue={crawlSetting?.vjudge?.password || ''}/>
                        </Col>
                    </Row>
                    <Row>
                        <Text
                            type="danger">你的vjudge账号密码只会本地保存不会上传。如有顾虑，可选择新建一个vjudge账户填入或不使用vjudge相关爬虫。
                        </Text>
                    </Row>
                    <Row style={{
                        marginTop: 10,
                    }}>
                        <Button theme="solid" onClick={() => {
                            const setting = Object.assign(crawlSetting, {
                                vjudge: {
                                    username: formData?.crawlVjudgeUsername || '',
                                    password: formData?.crawlVjudgePassword || '',
                                },
                            });
                            const promise = formData ?
                                UpdateCrawlSetting(new CrawlSetting(setting)) :
                                new Promise((resolve) => {
                                    resolve(undefined);
                                });
                            promise.then(() => {
                                Modal.success({
                                    hasCancel: false,
                                    title: '设置修改成功',
                                    onOk: () => {
                                        SetPageInfo(new PageInfo({
                                            page: 'setting',
                                        })).then(r => {
                                        });
                                    },
                                });
                            });
                        }}>
                            确认
                        </Button>
                    </Row>
                </Section>
                <Section text="其他">
                    <Row style={{
                        marginTop: 10,
                    }}>
                        <Button theme="solid" onClick={() => {
                            Modal.confirm({
                                title: '确认清除爬虫缓存',
                                onOk() {
                                    CleanCrawlCache().then(() => {
                                        Modal.success({
                                            title: '清除成功',
                                        });
                                    }).catch((e) => {
                                        alert(e);
                                    });
                                },
                            });
                        }}>
                            清除爬虫缓存
                        </Button>
                    </Row>
                </Section>
            </Form>
        </div>
    );
}