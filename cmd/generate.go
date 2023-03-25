package main

import (
	"os"
	"path"
	"path/filepath"
	"runtime"

	"gorm.io/gen"

	"github.com/goodguy-project/goodguy-desktop/dal/method"
	"github.com/goodguy-project/goodguy-desktop/dal/model"
)

func main() {
	_, filename, _, _ := runtime.Caller(0)
	root := path.Dir(path.Dir(filename))

	pwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	root, err = filepath.Rel(pwd, root)
	if err != nil {
		panic(err)
	}

	g := gen.NewGenerator(gen.Config{
		OutPath:           path.Join(root, "dal", "query"),
		FieldWithIndexTag: true,
		FieldWithTypeTag:  true,
	})
	g.ApplyBasic(model.Follower{})
	g.ApplyBasic(model.CrawlLog{})
	g.ApplyInterface(func(method.CrawlLog) {}, model.CrawlLog{})
	g.Execute()
}
