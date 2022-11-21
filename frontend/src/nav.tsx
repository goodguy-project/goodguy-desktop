import {Nav} from "@douyinfe/semi-ui";
import {
    IconCalendar,
    IconDesktop,
    IconMoon,
    IconPulse,
    IconSetting,
    IconSun,
    IconUserGroup
} from "@douyinfe/semi-icons";
import {Dispatch, useEffect, useState} from "react";
import {Page} from "./page/page";

const darkModeStorageKey = 'goodguy-desktop.dark-mode';

function IsDarkMode(): boolean {
    return window.localStorage.getItem(darkModeStorageKey) === '1';
}

export default function Navigation(props: { page: Page, setPage: Dispatch<Page> }): JSX.Element {
    const {page, setPage} = props;
    const [isDarkMode, setIsDarkMode] = useState(IsDarkMode());
    const DoSwitchMode = (dark: boolean) => {
        dark ?
            document.body.setAttribute('theme-mode', 'dark') :
            document.body.removeAttribute('theme-mode');
    };
    useEffect(() => {
        if (isDarkMode) {
            DoSwitchMode(isDarkMode);
        }
    }, []);
    const OnClickSwitchMode = () => {
        DoSwitchMode(!isDarkMode);
        window.localStorage.setItem(darkModeStorageKey, isDarkMode ? '0' : '1');
        setIsDarkMode(!isDarkMode);
    };

    const footer = <></>;
    // 暗色模式不好用
    // const footer = isDarkMode ? (
    //     <IconSun onClick={OnClickSwitchMode}/>
    // ) : (
    //     <IconMoon color="#FFFFFF" onClick={OnClickSwitchMode}/>
    // );
    return (
        <Nav
            selectedKeys={[page]}
            items={[
                {itemKey: 'calendar', text: '比赛日历', icon: <IconCalendar/>},
                {itemKey: 'follower', text: '关注', icon: <IconUserGroup/>},
                {itemKey: 'compare', text: '对比', icon: <IconPulse/>},
                {itemKey: 'setting', text: '设置', icon: <IconSetting/>}
            ]}
            mode="horizontal"
            header={{
                logo: <div><IconDesktop/></div>,
                text: '训练助手客户端',
            }}
            onSelect={(key) => {
                console.log(key);
                setPage(key.itemKey.toString() as Page);
            }}
            footer={footer}
        />
    );
}