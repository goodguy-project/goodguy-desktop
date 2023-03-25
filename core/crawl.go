package core

import (
	"context"
	"math"
	"os"
	"reflect"
	"sync"
	"time"

	"github.com/bytedance/sonic"
	"github.com/goodguy-project/goodguy-crawl/crawl/acwing"
	"github.com/goodguy-project/goodguy-crawl/crawl/atcoder"
	"github.com/goodguy-project/goodguy-crawl/crawl/codechef"
	"github.com/goodguy-project/goodguy-crawl/crawl/codeforces"
	"github.com/goodguy-project/goodguy-crawl/crawl/leetcode"
	"github.com/goodguy-project/goodguy-crawl/crawl/luogu"
	"github.com/goodguy-project/goodguy-crawl/crawl/nowcoder"
	"github.com/goodguy-project/goodguy-crawl/crawl/vjudge"
	"github.com/goodguy-project/goodguy-crawl/proto"
	"github.com/goodguy-project/goodguy-crawl/util/cachex"
	"github.com/goodguy-project/goodguy-crawl/util/errorx"
	"github.com/goodguy-project/goodguy-crawl/util/jsonx"

	"github.com/goodguy-project/goodguy-desktop/dal"
	"github.com/goodguy-project/goodguy-desktop/dal/model"
)

type Crawler struct {
}

type (
	getContestRecordFunction func(*proto.GetContestRecordRequest) (*proto.GetContestRecordResponse, error)
	getSubmitRecordFunction  func(*proto.GetSubmitRecordRequest) (*proto.GetSubmitRecordResponse, error)
	getRecentContestFunction func(*proto.GetRecentContestRequest) (*proto.GetRecentContestResponse, error)
	getDailyQuestionFunction func(*proto.GetDailyQuestionRequest) (*proto.GetDailyQuestionResponse, error)
)

var (
	getContestRecordMap = map[string]getContestRecordFunction{
		"codeforces": codeforces.GetContestRecord,
		"atcoder":    atcoder.GetContestRecord,
		"nowcoder":   nowcoder.GetContestRecord,
		"leetcode":   leetcode.GetContestRecord,
	}
	getSubmitRecordMap = map[string]getSubmitRecordFunction{
		"codeforces": codeforces.GetSubmitRecord,
		"luogu":      luogu.GetSubmitRecord,
		"vjudge":     vjudge.GetSubmitRecord,
	}
	getRecentContestMap = map[string]getRecentContestFunction{
		"codeforces": codeforces.GetRecentContest,
		"atcoder":    atcoder.GetRecentContest,
		"nowcoder":   nowcoder.GetRecentContest,
		"luogu":      luogu.GetRecentContest,
		"leetcode":   leetcode.GetRecentContest,
		"codechef":   codechef.GetRecentContest,
		"acwing":     acwing.GetRecentContest,
	}
	getDailyQuestionMap = map[string]getDailyQuestionFunction{
		"leetcode": leetcode.GetDailyQuestion,
	}
)

func doCrawl[Resp any, Req any](function string, req Req, callback func(Req) (Resp, error)) (Resp, error) {
	hash := cachex.Hash(reflect.ValueOf(req))
	if hash > math.MaxInt64 {
		hash /= 2
	}
	q, unlock := dal.Query()
	defer unlock()
	reqJson := jsonx.MarshalString(req)
	resp, err := q.CrawlLog.WithContext(context.Background()).SelectLatestLog(function, hash, reqJson)
	if err != nil {
		_ = errorx.New(err)
	}
	if err == nil && len(resp) > 0 {
		r, err := jsonx.Unmarshal[Resp](resp[0].Response)
		if err == nil {
			return r, nil
		}
		_ = errorx.New(err)
	}
	now := time.Now()
	r, err := callback(req)
	if err != nil {
		return r, errorx.New(err)
	}
	err = q.CrawlLog.WithContext(context.Background()).Save(&model.CrawlLog{
		CrawlTime: now,
		Hash:      hash,
		Function:  function,
		Request:   reqJson,
		Response:  jsonx.MarshalString(r),
	})
	if err != nil {
		_ = errorx.New(err)
	}
	return r, nil
}

func (*Crawler) GetContestRecord(req *proto.GetContestRecordRequest) (*proto.GetContestRecordResponse, error) {
	callback, ok := getContestRecordMap[req.GetPlatform()]
	if !ok {
		return nil, errorx.New(nil)
	}
	return doCrawl[*proto.GetContestRecordResponse]("GetContestRecord", req, callback)
}

func (*Crawler) GetSubmitRecord(req *proto.GetSubmitRecordRequest) (*proto.GetSubmitRecordResponse, error) {
	callback, ok := getSubmitRecordMap[req.GetPlatform()]
	if !ok {
		return nil, errorx.New(nil)
	}
	return doCrawl[*proto.GetSubmitRecordResponse]("GetSubmitRecord", req, callback)
}

func (*Crawler) GetRecentContest(req *proto.GetRecentContestRequest) (*proto.GetRecentContestResponse, error) {
	callback, ok := getRecentContestMap[req.GetPlatform()]
	if !ok {
		return nil, errorx.New(nil)
	}
	return doCrawl[*proto.GetRecentContestResponse]("GetRecentContest", req, callback)
}

func (*Crawler) GetDailyQuestion(req *proto.GetDailyQuestionRequest) (*proto.GetDailyQuestionResponse, error) {
	callback, ok := getDailyQuestionMap[req.GetPlatform()]
	if !ok {
		return nil, errorx.New(nil)
	}
	return doCrawl[*proto.GetDailyQuestionResponse]("GetDailyQuestion", req, callback)
}

func (*Crawler) CleanCrawlCache() {
	q, unlock := dal.Query()
	defer unlock()
	_, err := q.CrawlLog.WithContext(context.Background()).Where(q.CrawlLog.ID.Gte(0)).Delete() // delete all log
	if err != nil {
		_ = errorx.New(err)
	}
}

type CrawlSetting struct {
	Vjudge *struct {
		Username string `json:"username,omitempty"`
		Password string `json:"password,omitempty"`
	} `json:"vjudge,omitempty"`
}

const crawlSettingFilename = ".goodguy-desktop/crawl-setting.json"

var (
	crawlSettingMutex sync.Mutex
)

func (*Crawler) GetCrawlSetting() *CrawlSetting {
	crawlSettingMutex.Lock()
	defer crawlSettingMutex.Unlock()
	file, err := os.ReadFile(crawlSettingFilename)
	crawlSetting := &CrawlSetting{}
	if err != nil {
		return crawlSetting
	}
	if err = sonic.Unmarshal(file, crawlSetting); err != nil {
		return crawlSetting
	}
	return crawlSetting
}

func (*Crawler) UpdateCrawlSetting(setting *CrawlSetting) {
	crawlSettingMutex.Lock()
	defer crawlSettingMutex.Unlock()
	data, err := sonic.Marshal(setting)
	if err != nil {
		panic(err)
	}
	dal.CheckAndMakeDir()
	err = os.WriteFile(crawlSettingFilename, data, 0666)
	if err != nil {
		panic(err)
	}
}
