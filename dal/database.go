package dal

import (
	"sync"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/goodguy-project/goodguy-desktop/dal/model"
	"github.com/goodguy-project/goodguy-desktop/dal/query"
)

var (
	dbObject *gorm.DB
	dbOnce   sync.Once
)

func db() *gorm.DB {
	dbOnce.Do(func() {
		var err error
		CheckAndMakeDir()
		dbObject, err = gorm.Open(sqlite.Open(".goodguy-desktop/goodguy-desktop.sqlite3"), &gorm.Config{})
		if err != nil {
			panic(err)
		}
		err = dbObject.AutoMigrate(&model.Follower{}, &model.CrawlLog{})
		if err != nil {
			panic(err)
		}
	})
	return dbObject
}

var (
	qObject    *query.Query
	queryOnce  sync.Once
	queryMutex sync.Mutex
)

func Query() (q *query.Query, unlock func()) {
	queryOnce.Do(func() {
		qObject = query.Use(db())
	})
	queryMutex.Lock()
	return qObject, queryMutex.Unlock
}
