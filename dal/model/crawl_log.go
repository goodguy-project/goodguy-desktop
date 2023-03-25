package model

import (
	"time"

	"gorm.io/gorm"
)

type CrawlLog struct {
	gorm.Model

	CrawlTime time.Time `gorm:"column:crawl_time;index"`
	Hash      uint64    `gorm:"column:hash;index"`
	Function  string    `gorm:"column:function"`
	Request   string    `gorm:"column:request"`
	Response  string    `gorm:"column:response"`
}

func (*CrawlLog) TableName() string {
	return "crawl_log"
}
