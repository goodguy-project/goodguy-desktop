// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/schema"

	"gorm.io/gen"
	"gorm.io/gen/field"

	"gorm.io/plugin/dbresolver"

	"github.com/goodguy-project/goodguy-desktop/dal/model"
)

func newCrawlLog(db *gorm.DB, opts ...gen.DOOption) crawlLog {
	_crawlLog := crawlLog{}

	_crawlLog.crawlLogDo.UseDB(db, opts...)
	_crawlLog.crawlLogDo.UseModel(&model.CrawlLog{})

	tableName := _crawlLog.crawlLogDo.TableName()
	_crawlLog.ALL = field.NewAsterisk(tableName)
	_crawlLog.ID = field.NewUint(tableName, "id")
	_crawlLog.CreatedAt = field.NewTime(tableName, "created_at")
	_crawlLog.UpdatedAt = field.NewTime(tableName, "updated_at")
	_crawlLog.DeletedAt = field.NewField(tableName, "deleted_at")
	_crawlLog.CrawlTime = field.NewTime(tableName, "crawl_time")
	_crawlLog.Hash = field.NewUint64(tableName, "hash")
	_crawlLog.Function = field.NewString(tableName, "function")
	_crawlLog.Request = field.NewString(tableName, "request")
	_crawlLog.Response = field.NewString(tableName, "response")

	_crawlLog.fillFieldMap()

	return _crawlLog
}

type crawlLog struct {
	crawlLogDo crawlLogDo

	ALL       field.Asterisk
	ID        field.Uint
	CreatedAt field.Time
	UpdatedAt field.Time
	DeletedAt field.Field
	CrawlTime field.Time
	Hash      field.Uint64
	Function  field.String
	Request   field.String
	Response  field.String

	fieldMap map[string]field.Expr
}

func (c crawlLog) Table(newTableName string) *crawlLog {
	c.crawlLogDo.UseTable(newTableName)
	return c.updateTableName(newTableName)
}

func (c crawlLog) As(alias string) *crawlLog {
	c.crawlLogDo.DO = *(c.crawlLogDo.As(alias).(*gen.DO))
	return c.updateTableName(alias)
}

func (c *crawlLog) updateTableName(table string) *crawlLog {
	c.ALL = field.NewAsterisk(table)
	c.ID = field.NewUint(table, "id")
	c.CreatedAt = field.NewTime(table, "created_at")
	c.UpdatedAt = field.NewTime(table, "updated_at")
	c.DeletedAt = field.NewField(table, "deleted_at")
	c.CrawlTime = field.NewTime(table, "crawl_time")
	c.Hash = field.NewUint64(table, "hash")
	c.Function = field.NewString(table, "function")
	c.Request = field.NewString(table, "request")
	c.Response = field.NewString(table, "response")

	c.fillFieldMap()

	return c
}

func (c *crawlLog) WithContext(ctx context.Context) *crawlLogDo { return c.crawlLogDo.WithContext(ctx) }

func (c crawlLog) TableName() string { return c.crawlLogDo.TableName() }

func (c crawlLog) Alias() string { return c.crawlLogDo.Alias() }

func (c *crawlLog) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := c.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (c *crawlLog) fillFieldMap() {
	c.fieldMap = make(map[string]field.Expr, 9)
	c.fieldMap["id"] = c.ID
	c.fieldMap["created_at"] = c.CreatedAt
	c.fieldMap["updated_at"] = c.UpdatedAt
	c.fieldMap["deleted_at"] = c.DeletedAt
	c.fieldMap["crawl_time"] = c.CrawlTime
	c.fieldMap["hash"] = c.Hash
	c.fieldMap["function"] = c.Function
	c.fieldMap["request"] = c.Request
	c.fieldMap["response"] = c.Response
}

func (c crawlLog) clone(db *gorm.DB) crawlLog {
	c.crawlLogDo.ReplaceConnPool(db.Statement.ConnPool)
	return c
}

func (c crawlLog) replaceDB(db *gorm.DB) crawlLog {
	c.crawlLogDo.ReplaceDB(db)
	return c
}

type crawlLogDo struct{ gen.DO }

// SelectLatestLog 查找最近的爬取记录
//
// SELECT * FROM crawl_log
// WHERE crawl_time = (
//
//	SELECT max(crawl_time) FROM crawl_log
//	WHERE function = @function AND hash = @hash AND request = @request AND deleted_at IS NULL
//
// ) AND function = @function AND hash = @hash AND request = @request AND deleted_at IS NULL
func (c crawlLogDo) SelectLatestLog(function string, hash uint64, request string) (result []*model.CrawlLog, err error) {
	var params []interface{}

	var generateSQL strings.Builder
	params = append(params, function)
	params = append(params, hash)
	params = append(params, request)
	params = append(params, function)
	params = append(params, hash)
	params = append(params, request)
	generateSQL.WriteString("SELECT * FROM crawl_log WHERE crawl_time = ( SELECT max(crawl_time) FROM crawl_log WHERE function = ? AND hash = ? AND request = ? AND deleted_at IS NULL ) AND function = ? AND hash = ? AND request = ? AND deleted_at IS NULL ")

	var executeSQL *gorm.DB
	executeSQL = c.UnderlyingDB().Raw(generateSQL.String(), params...).Find(&result) // ignore_security_alert
	err = executeSQL.Error

	return
}

func (c crawlLogDo) Debug() *crawlLogDo {
	return c.withDO(c.DO.Debug())
}

func (c crawlLogDo) WithContext(ctx context.Context) *crawlLogDo {
	return c.withDO(c.DO.WithContext(ctx))
}

func (c crawlLogDo) ReadDB() *crawlLogDo {
	return c.Clauses(dbresolver.Read)
}

func (c crawlLogDo) WriteDB() *crawlLogDo {
	return c.Clauses(dbresolver.Write)
}

func (c crawlLogDo) Session(config *gorm.Session) *crawlLogDo {
	return c.withDO(c.DO.Session(config))
}

func (c crawlLogDo) Clauses(conds ...clause.Expression) *crawlLogDo {
	return c.withDO(c.DO.Clauses(conds...))
}

func (c crawlLogDo) Returning(value interface{}, columns ...string) *crawlLogDo {
	return c.withDO(c.DO.Returning(value, columns...))
}

func (c crawlLogDo) Not(conds ...gen.Condition) *crawlLogDo {
	return c.withDO(c.DO.Not(conds...))
}

func (c crawlLogDo) Or(conds ...gen.Condition) *crawlLogDo {
	return c.withDO(c.DO.Or(conds...))
}

func (c crawlLogDo) Select(conds ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.Select(conds...))
}

func (c crawlLogDo) Where(conds ...gen.Condition) *crawlLogDo {
	return c.withDO(c.DO.Where(conds...))
}

func (c crawlLogDo) Exists(subquery interface{ UnderlyingDB() *gorm.DB }) *crawlLogDo {
	return c.Where(field.CompareSubQuery(field.ExistsOp, nil, subquery.UnderlyingDB()))
}

func (c crawlLogDo) Order(conds ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.Order(conds...))
}

func (c crawlLogDo) Distinct(cols ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.Distinct(cols...))
}

func (c crawlLogDo) Omit(cols ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.Omit(cols...))
}

func (c crawlLogDo) Join(table schema.Tabler, on ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.Join(table, on...))
}

func (c crawlLogDo) LeftJoin(table schema.Tabler, on ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.LeftJoin(table, on...))
}

func (c crawlLogDo) RightJoin(table schema.Tabler, on ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.RightJoin(table, on...))
}

func (c crawlLogDo) Group(cols ...field.Expr) *crawlLogDo {
	return c.withDO(c.DO.Group(cols...))
}

func (c crawlLogDo) Having(conds ...gen.Condition) *crawlLogDo {
	return c.withDO(c.DO.Having(conds...))
}

func (c crawlLogDo) Limit(limit int) *crawlLogDo {
	return c.withDO(c.DO.Limit(limit))
}

func (c crawlLogDo) Offset(offset int) *crawlLogDo {
	return c.withDO(c.DO.Offset(offset))
}

func (c crawlLogDo) Scopes(funcs ...func(gen.Dao) gen.Dao) *crawlLogDo {
	return c.withDO(c.DO.Scopes(funcs...))
}

func (c crawlLogDo) Unscoped() *crawlLogDo {
	return c.withDO(c.DO.Unscoped())
}

func (c crawlLogDo) Create(values ...*model.CrawlLog) error {
	if len(values) == 0 {
		return nil
	}
	return c.DO.Create(values)
}

func (c crawlLogDo) CreateInBatches(values []*model.CrawlLog, batchSize int) error {
	return c.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (c crawlLogDo) Save(values ...*model.CrawlLog) error {
	if len(values) == 0 {
		return nil
	}
	return c.DO.Save(values)
}

func (c crawlLogDo) First() (*model.CrawlLog, error) {
	if result, err := c.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*model.CrawlLog), nil
	}
}

func (c crawlLogDo) Take() (*model.CrawlLog, error) {
	if result, err := c.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*model.CrawlLog), nil
	}
}

func (c crawlLogDo) Last() (*model.CrawlLog, error) {
	if result, err := c.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*model.CrawlLog), nil
	}
}

func (c crawlLogDo) Find() ([]*model.CrawlLog, error) {
	result, err := c.DO.Find()
	return result.([]*model.CrawlLog), err
}

func (c crawlLogDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*model.CrawlLog, err error) {
	buf := make([]*model.CrawlLog, 0, batchSize)
	err = c.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (c crawlLogDo) FindInBatches(result *[]*model.CrawlLog, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return c.DO.FindInBatches(result, batchSize, fc)
}

func (c crawlLogDo) Attrs(attrs ...field.AssignExpr) *crawlLogDo {
	return c.withDO(c.DO.Attrs(attrs...))
}

func (c crawlLogDo) Assign(attrs ...field.AssignExpr) *crawlLogDo {
	return c.withDO(c.DO.Assign(attrs...))
}

func (c crawlLogDo) Joins(fields ...field.RelationField) *crawlLogDo {
	for _, _f := range fields {
		c = *c.withDO(c.DO.Joins(_f))
	}
	return &c
}

func (c crawlLogDo) Preload(fields ...field.RelationField) *crawlLogDo {
	for _, _f := range fields {
		c = *c.withDO(c.DO.Preload(_f))
	}
	return &c
}

func (c crawlLogDo) FirstOrInit() (*model.CrawlLog, error) {
	if result, err := c.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*model.CrawlLog), nil
	}
}

func (c crawlLogDo) FirstOrCreate() (*model.CrawlLog, error) {
	if result, err := c.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*model.CrawlLog), nil
	}
}

func (c crawlLogDo) FindByPage(offset int, limit int) (result []*model.CrawlLog, count int64, err error) {
	result, err = c.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = c.Offset(-1).Limit(-1).Count()
	return
}

func (c crawlLogDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = c.Count()
	if err != nil {
		return
	}

	err = c.Offset(offset).Limit(limit).Scan(result)
	return
}

func (c crawlLogDo) Scan(result interface{}) (err error) {
	return c.DO.Scan(result)
}

func (c crawlLogDo) Delete(models ...*model.CrawlLog) (result gen.ResultInfo, err error) {
	return c.DO.Delete(models)
}

func (c *crawlLogDo) withDO(do gen.Dao) *crawlLogDo {
	c.DO = *do.(*gen.DO)
	return c
}
