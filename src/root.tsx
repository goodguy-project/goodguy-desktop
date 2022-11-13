import Navigation from "./nav";
import Calendar from "./calendar";
import Follower from "./follower";
import {ReactNode} from "react";
import {Page} from "./page";
import Loading from "./loading";
import {FrontEndJump} from "./util";

export default function Root() {
    const page: Page = (new URLSearchParams(window.location.search).get('page') || 'calendar') as Page;
    console.log(window.location.href);
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
    ]);
    return (
        <div>
            <Navigation page={page} setPage={setPage}/>
            {PageMap.get(page)}
        </div>
    );
}