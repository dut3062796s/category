category
========

省市联动，无限极分类下拉选择插件



简介

无限极分类下拉选择插件，经历数个版本，最初使用的jquery bind函数绑定select标签onchange事件。
当前版本使用jquery delegate 方式进行事件处理，代码得到了大大的精简。
理论上支持所有类似 id,name,parendid 数据库表结构，例如：

``` sql
CREATE TABLE `cate_district` (
  `id` MEDIUMINT(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL DEFAULT '',
  `level` TINYINT(4) UNSIGNED NOT NULL DEFAULT '0',
  `usetype` TINYINT(1) UNSIGNED NOT NULL DEFAULT '0',
  `upid` MEDIUMINT(8) UNSIGNED NOT NULL DEFAULT '0',
  `displayorder` SMALLINT(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `upid` (`upid`, `displayorder`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=45052;

//普通商品分类
CREATE TABLE `cate_category` (
  `id` MEDIUMINT(9) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `upid` MEDIUMINT(9) NOT NULL,
  PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;
```
关于功能部分可以看下面演示，提供所有你能想到的功能，并且经历过各种实际项目的考验
功能演示

点击查看
下载地址
参数详解

url:ajax获取数据连接（注意使用的GET请求,需要返回JSON数据）。

handel:回调函数格式化集合中每条数据，如何生成选项。

path:当前参数是用于还原选择状态的。（举个例子：当你在编辑商品的时候之前的分类选择需要还原吧）格式：0,2,3,45

change:每次选择后会调用此方法，同时会传入1个 array 对象里面包含了当前选择的选择树，类似这样的结构["0","2","3"]

filter:当时方法起到数据过滤的作用，有些从服务器传来的部分数据由于特殊业务，不能选择。可以通过当前方法进行过滤掉，如果你不想过滤请将参数返回。

param:修改发送服务器接受格式，有时候面向服务器API编程，服务器方规定参数的名称，就需要通过此方法进行AJAX参数格式化

async:当前为一个异步开关，当为false 使用本地数据，true 时为异步ajax请求。配合 provider 方法使用
相关备注
帮助

``` javascript	
//异步请求地址 当 async 为false时当前值无效
url: "/category/list",
//数据格式处理
handel: function (v) {
    return "<option value='" + v.Id + "'>" + v.Name + "</option>";
},
//状态还原，用于编辑状态下
path: 0,
//拆分字符
sChar: ',',
//当用户选择后触发当前回调函数
change: function (v) { },
//数据过滤使用
filter: function (v) { return v; },
//格式化发送到服务器的数据
param: function (id) { return { parentId: id }; },
//异步开关
async: true,
//同步数据提供
provider: function (id) {
return [];
}
```
