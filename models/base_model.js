//引入工具模块
const tools = require('./tools');
module.exports = (schema)=>{
    schema.methods.create_time_ago = function(){
        return tools.formatDate(this.create_time,true);
    };
    schema.methods.update_time_ago = function(){
        return tools.formatDate(this.update_time,true);
    }
}