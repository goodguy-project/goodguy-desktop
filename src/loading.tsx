import {Spin} from "@douyinfe/semi-ui";

export default function Loading(): JSX.Element {
    return (
        <div style={{
            margin: 'auto',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(1.8)',
            textAlign: 'center',
        }}>
            <Spin size={"large"}/>
            <p>页面加载中</p>
        </div>
    );
}