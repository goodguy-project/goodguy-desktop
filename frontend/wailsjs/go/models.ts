export namespace core {
	
	export class CrawlSetting {
	    // Go type: struct { Username string "json:\"username,omitempty\""; Password string "json:\"password,omitempty\"" }
	    vjudge?: any;
	
	    static createFrom(source: any = {}) {
	        return new CrawlSetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.vjudge = this.convertValues(source["vjudge"], Object);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SearchFollowerRequest {
	    id?: number[];
	
	    static createFrom(source: any = {}) {
	        return new SearchFollowerRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	    }
	}

}

export namespace main {
	
	export class PageInfo {
	    page?: string;
	    // Go type: struct { Page string "json:\"page,omitempty\""; Fid *int64 "json:\"fid,omitempty\"" }
	    follower?: any;
	    // Go type: struct { Fid []int64 "json:\"fid,omitempty\"" }
	    compare?: any;
	
	    static createFrom(source: any = {}) {
	        return new PageInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.page = source["page"];
	        this.follower = this.convertValues(source["follower"], Object);
	        this.compare = this.convertValues(source["compare"], Object);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace model {
	
	export class Follower {
	    id: number;
	    name: string;
	    codeforces_id: string;
	    atcoder_id: string;
	    nowcoder_id: string;
	    luogu_id: string;
	    vjudge_id: string;
	    leetcode_id: string;
	
	    static createFrom(source: any = {}) {
	        return new Follower(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.codeforces_id = source["codeforces_id"];
	        this.atcoder_id = source["atcoder_id"];
	        this.nowcoder_id = source["nowcoder_id"];
	        this.luogu_id = source["luogu_id"];
	        this.vjudge_id = source["vjudge_id"];
	        this.leetcode_id = source["leetcode_id"];
	    }
	}

}

export namespace proto {
	
	export class AuthInfo {
	    username?: string;
	    password?: string;
	
	    static createFrom(source: any = {}) {
	        return new AuthInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.password = source["password"];
	    }
	}
	export class GetContestRecordRequest {
	    platform?: string;
	    handle?: string;
	
	    static createFrom(source: any = {}) {
	        return new GetContestRecordRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.platform = source["platform"];
	        this.handle = source["handle"];
	    }
	}
	export class GetContestRecordResponse_Record {
	    name?: string;
	    url?: string;
	    timestamp?: number;
	    rating?: number;
	
	    static createFrom(source: any = {}) {
	        return new GetContestRecordResponse_Record(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.url = source["url"];
	        this.timestamp = source["timestamp"];
	        this.rating = source["rating"];
	    }
	}
	export class GetContestRecordResponse {
	    profile_url?: string;
	    rating?: number;
	    length?: number;
	    record?: GetContestRecordResponse_Record[];
	    platform?: string;
	    handle?: string;
	
	    static createFrom(source: any = {}) {
	        return new GetContestRecordResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.profile_url = source["profile_url"];
	        this.rating = source["rating"];
	        this.length = source["length"];
	        this.record = this.convertValues(source["record"], GetContestRecordResponse_Record);
	        this.platform = source["platform"];
	        this.handle = source["handle"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetDailyQuestionRequest {
	    platform?: string;
	
	    static createFrom(source: any = {}) {
	        return new GetDailyQuestionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.platform = source["platform"];
	    }
	}
	export class GetDailyQuestionResponse_Problem {
	    platform?: string;
	    url?: string;
	    id?: string;
	    name?: string;
	    difficulty?: string;
	    extra?: {[key: string]: string};
	
	    static createFrom(source: any = {}) {
	        return new GetDailyQuestionResponse_Problem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.platform = source["platform"];
	        this.url = source["url"];
	        this.id = source["id"];
	        this.name = source["name"];
	        this.difficulty = source["difficulty"];
	        this.extra = source["extra"];
	    }
	}
	export class GetDailyQuestionResponse {
	    problem?: GetDailyQuestionResponse_Problem[];
	
	    static createFrom(source: any = {}) {
	        return new GetDailyQuestionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.problem = this.convertValues(source["problem"], GetDailyQuestionResponse_Problem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetRecentContestRequest {
	    platform?: string;
	
	    static createFrom(source: any = {}) {
	        return new GetRecentContestRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.platform = source["platform"];
	    }
	}
	export class GetRecentContestResponse_Contest {
	    name?: string;
	    url?: string;
	    timestamp?: number;
	    ext_info?: {[key: string]: string};
	    duration?: number;
	
	    static createFrom(source: any = {}) {
	        return new GetRecentContestResponse_Contest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.url = source["url"];
	        this.timestamp = source["timestamp"];
	        this.ext_info = source["ext_info"];
	        this.duration = source["duration"];
	    }
	}
	export class GetRecentContestResponse {
	    recent_contest?: GetRecentContestResponse_Contest[];
	    platform?: string;
	
	    static createFrom(source: any = {}) {
	        return new GetRecentContestResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.recent_contest = this.convertValues(source["recent_contest"], GetRecentContestResponse_Contest);
	        this.platform = source["platform"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetSubmitRecordRequest {
	    platform?: string;
	    handle?: string;
	    auth_info?: AuthInfo;
	
	    static createFrom(source: any = {}) {
	        return new GetSubmitRecordRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.platform = source["platform"];
	        this.handle = source["handle"];
	        this.auth_info = this.convertValues(source["auth_info"], AuthInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetSubmitRecordResponse_SubmitRecord {
	    problem_name?: string;
	    problem_url?: string;
	    submit_time?: number;
	    verdict?: number;
	    running_time?: number;
	    programming_language?: number;
	
	    static createFrom(source: any = {}) {
	        return new GetSubmitRecordResponse_SubmitRecord(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.problem_name = source["problem_name"];
	        this.problem_url = source["problem_url"];
	        this.submit_time = source["submit_time"];
	        this.verdict = source["verdict"];
	        this.running_time = source["running_time"];
	        this.programming_language = source["programming_language"];
	    }
	}
	export class GetSubmitRecordResponse {
	    profile_url?: string;
	    accept_count?: number;
	    submit_count?: number;
	    distribution?: {[key: number]: number};
	    oj_distribution?: {[key: string]: number};
	    platform?: string;
	    handle?: string;
	    submit_record?: GetSubmitRecordResponse_SubmitRecord[];
	
	    static createFrom(source: any = {}) {
	        return new GetSubmitRecordResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.profile_url = source["profile_url"];
	        this.accept_count = source["accept_count"];
	        this.submit_count = source["submit_count"];
	        this.distribution = source["distribution"];
	        this.oj_distribution = source["oj_distribution"];
	        this.platform = source["platform"];
	        this.handle = source["handle"];
	        this.submit_record = this.convertValues(source["submit_record"], GetSubmitRecordResponse_SubmitRecord);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

