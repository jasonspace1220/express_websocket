var Model = require("./Model")

class FbComment extends Model {
    constructor() {
        super();
        this.table = "fb_comment"
        this.data;
    }

    async selectAllData() {
        let sql = `SELECT * FROM ${this.table}`
        let dataList = await this.query(sql)
        return dataList
    }
    async updateOne(setCond, whereCond) {
        let sql = `UPDATE ${this.table} SET ${setCond} WHERE ${whereCond}`
        let dataList = await this.query(sql)
        return dataList;
    }

}

module.exports = FbComment