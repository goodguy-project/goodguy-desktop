import Navigation from "./nav";
import Calendar from "./page/calendar";
import Follower from "./page/follower";
import {ReactNode} from "react";
import {Page} from "./page/page";
import Loading from "./page/loading";
import Compare from "./page/compare";
import Setting from "./page/setting";
import {GetPageInfo} from "../wailsjs/go/main/App";
import {main} from "../wailsjs/go/models";
import PageInfo = main.PageInfo;
import Sync from "./util/sync";

async function root(): Promise<JSX.Element> {
    const pageInfo: PageInfo = await GetPageInfo();
    const page: Page = pageInfo.page as Page;
    const PageMap = new Map<Page, ReactNode>([
        ['calendar', <Calendar/>],
        ['follower', <Follower pageInfo={pageInfo}/>],
        ['compare', <Compare pageInfo={pageInfo}/>],
        ['setting', <Setting/>],
    ]);
    return (
        <div>
            <Navigation pageInfo={pageInfo}/>
            {PageMap.get(page)}
        </div>
    );
}

export default function Root(): JSX.Element {
    return Sync(root(), () => <Loading/>);
}