import Navigation from "./nav";
import Calendar from "./page/calendar";
import Follower from "./page/follower";
import {ReactNode} from "react";
import {Page} from "./page/page";
import Loading from "./page/loading";
import {FrontEndJump} from "./util/jump";
import Compare from "./page/compare";
import Setting from "./page/setting";

export default function Root() {
    const page: Page = (new URLSearchParams(window.location.search).get('page') || 'calendar') as Page;
    // console.log(window.location.href);
    const setPage = (page: Page): void => {
        const urlParam = new URLSearchParams(window.location.search);
        urlParam.set('page', page);
        urlParam.delete('sub_page');
        FrontEndJump(urlParam);
    };
    if (page === 'loading') {
        return <Loading/>;
    }
    const PageMap = new Map<Page, ReactNode>([
        ['calendar', <Calendar/>],
        ['follower', <Follower setPage={setPage}/>],
        ['compare', <Compare/>],
        ['setting', <Setting setPage={setPage}/>],
    ]);
    return (
        <div>
            <Navigation page={page} setPage={setPage}/>
            {PageMap.get(page)}
        </div>
    );
}