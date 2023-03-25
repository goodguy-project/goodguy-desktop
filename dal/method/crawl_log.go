package method

import "gorm.io/gen"

type CrawlLog interface {
	// SelectLatestLog 查找最近的爬取记录
	//
	// SELECT * FROM crawl_log
	// WHERE crawl_time = (
	//     SELECT max(crawl_time) FROM crawl_log
	//     WHERE function = @function AND hash = @hash AND request = @request AND deleted_at IS NULL
	// ) AND function = @function AND hash = @hash AND request = @request AND deleted_at IS NULL
	SelectLatestLog(function string, hash uint64, request string) ([]*gen.T, error)
}
