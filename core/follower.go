package core

import (
	"context"
	"os"

	"github.com/bytedance/sonic"

	"github.com/goodguy-project/goodguy-desktop/dal"
	"github.com/goodguy-project/goodguy-desktop/dal/model"
)

type FollowerHandler struct {
}

type SearchFollowerRequest struct {
	Id []uint `json:"id,omitempty"`
}

func (*FollowerHandler) SearchFollower(req *SearchFollowerRequest) ([]*model.Follower, error) {
	q, unlock := dal.Query()
	defer unlock()
	follower := q.Follower
	d := follower.WithContext(context.Background()).Debug()
	if len(req.Id) > 0 {
		d = d.Where(follower.ID.In(req.Id...))
	}
	return d.Find()
}

func (*FollowerHandler) SaveFollower(follower *model.Follower) error {
	q, unlock := dal.Query()
	defer unlock()
	return q.Follower.WithContext(context.Background()).Debug().Save(follower)
}

func (*FollowerHandler) DeleteFollower(id []uint) error {
	q, unlock := dal.Query()
	defer unlock()
	follower := q.Follower
	_, err := follower.WithContext(context.Background()).Debug().Where(follower.ID.In(id...)).Delete()
	return err
}

func (*FollowerHandler) LoadFollower(filename string) (err error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return err
	}
	followers := make([]*model.Follower, 0)
	err = sonic.Unmarshal(data, &followers)
	if err != nil {
		return err
	}
	q, unlock := dal.Query()
	defer unlock()
	tx := q.Begin()
	defer func() {
		if err != nil {
			if e := tx.Rollback(); e != nil {
				panic(e)
			}
		} else {
			err = tx.Commit()
		}
	}()
	ctx := context.Background()
	_, err = tx.Follower.WithContext(ctx).Where(q.Follower.ID.Gte(0)).Delete() // delete all follower
	if err != nil {
		return err
	}
	for _, follower := range followers {
		follower.ID = 0
		err = tx.Follower.WithContext(ctx).Save(follower)
		if err != nil {
			return err
		}
	}
	return nil
}
