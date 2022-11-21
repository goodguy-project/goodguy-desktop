import {Popover, Spin} from "@douyinfe/semi-ui";
import {IconAlertCircle} from "@douyinfe/semi-icons";

export const proportion = 0.37;

const notPrepareStyle = {
    width: '100%',
    height: `calc(100vh * ${proportion})`,
    backgroundColor: '#fafafa',
};

export function FailedElement(props: { platform?: string, name?: string, msg?: string }): JSX.Element {
    const {platform, name} = props;
    const list = [];
    if (platform) {
        list.push(platform);
    }
    if (name) {
        list.push(name);
    }
    const text = list.join(' - ');
    return (
        <div style={notPrepareStyle}>
            <Popover content={
                <article style={{
                    padding: 12,
                    textAlign: 'center',
                }}>
                    {text}
                    {text ? <br/> : <></>}
                    {props.msg ? props.msg : '网络错误/ID错误'}
                </article>
            }>
                <IconAlertCircle style={{
                    transform: 'scale(4.0)',
                    marginTop: `calc(100vh * ${proportion} * 0.45)`,
                    marginLeft: '45%',
                }}/>
            </Popover>
        </div>
    );
}

export function LoadingElement(props: {}): JSX.Element {
    return (
        <div style={notPrepareStyle}>
            <Spin style={{
                marginTop: `calc(100vh * ${proportion} * 0.45)`,
                marginLeft: '45%',
            }} size="large"/>
        </div>
    );
}

export function Unique<T>(v: T[]): T[] {
    const set = new Set<T>();
    const ret: T[] = [];
    for (const h of v) {
        if (!set.has(h)) {
            ret.push(h);
            set.add(h);
        }
    }
    return ret;
}
