package model

import (
	"time"

	"gorm.io/gorm"
)

type Follower struct {
	// explore for frontend
	ID        uint `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	// follower info
	Name         string `gorm:"column:name" json:"name"`
	CodeforcesId string `gorm:"column:codeforces_id"  json:"codeforces_id"`
	AtcoderId    string `gorm:"column:atcoder_id" json:"atcoder_id"`
	NowcoderId   string `gorm:"column:nowcoder_id" json:"nowcoder_id"`
	LuoguId      string `gorm:"column:luogu_id" json:"luogu_id"`
	VjudgeId     string `gorm:"column:vjudge_id" json:"vjudge_id"`
	LeetcodeId   string `gorm:"column:leetcode_id" json:"leetcode_id"`
}

func (*Follower) TableName() string {
	return "follower"
}
