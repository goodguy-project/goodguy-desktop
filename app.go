package main

import (
	"context"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/goodguy-project/goodguy-desktop/core"
)

type PageInfo struct {
	Page     string `json:"page,omitempty"`
	Follower *struct {
		Page string `json:"page,omitempty"`
		Fid  *int64 `json:"fid,omitempty"`
	} `json:"follower,omitempty"`
	Compare *struct {
		Fid []int64 `json:"fid,omitempty"`
	} `json:"compare,omitempty"`
}

type App struct {
	ctx  context.Context
	Page PageInfo

	*core.Crawler
	*core.FollowerHandler
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.Page.Page = "calendar"
	a.Crawler = &core.Crawler{}
}

func (a *App) SelectFile() (string, error) {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return "", err
	}
	return file, nil
}

func (a *App) SaveFile(data string) (string, error) {
	filename, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{})
	if err != nil {
		return "", err
	}
	if len(filename) > 0 {
		err = os.WriteFile(filename, []byte(data), 0666)
		if err != nil {
			return "", err
		}
	}
	return filename, nil
}

func (a *App) GetPageInfo() PageInfo {
	return a.Page
}

func (a *App) SetPageInfo(page PageInfo) {
	a.Page = page
	runtime.WindowReload(a.ctx)
}
