import {useState} from "react";
import {GetContestRecord, GetDailyQuestion, GetRecentContest, GetSubmitRecord} from "../wailsjs/go/main/App";
import {proto} from "../wailsjs/go/models";
import {LogError} from "../wailsjs/runtime";
import GetContestRecordRequest = proto.GetContestRecordRequest;
import GetSubmitRecordRequest = proto.GetSubmitRecordRequest;
import GetRecentContestRequest = proto.GetRecentContestRequest;
import GetDailyQuestionRequest = proto.GetDailyQuestionRequest;

type CrawlFunc = 'GetContestRecord' | 'GetSubmitRecord' | 'GetRecentContest' | 'GetDailyQuestion';

export function CrawlApi(func: CrawlFunc, param?: any) {
    const [resp, setResp] = useState<any>(undefined);
    if (resp === undefined) {
        param = param || {};
        let promise: Promise<any>;
        if (func === 'GetContestRecord') {
            promise = GetContestRecord(new GetContestRecordRequest(param));
        } else if (func === 'GetSubmitRecord') {
            promise = GetSubmitRecord(new GetSubmitRecordRequest(param));
        } else if (func === 'GetRecentContest') {
            promise = GetRecentContest(new GetRecentContestRequest(param));
        } else if (func === 'GetDailyQuestion') {
            promise = GetDailyQuestion(new GetDailyQuestionRequest(param));
        } else {
            const f: never = func;
            promise = new Promise<any>(() => f);
        }
        promise.then((value) => {
            if (value) {
                setTimeout(() => {
                    setResp({data: value});
                }, 0);
            } else {
                setResp(null);
            }
        }).catch((err) => {
            LogError(err.toString());
        });
    }
    // return null when failed
    if (resp === undefined || resp === null) {
        return resp;
    }
    return resp?.data;
}
