NeXt代码规范
===============================

# 组织结构目录
1. 框架(Framework)

    For example(next-core):
    
    |--next
      |--dest(Automatic generation)
        |--js
        |--css
      |--src
        |--fonts
        |--js
        |--less
      |--test
        |--unittest
        |--autotest
      |--tutorial
      |--.gitignore
      |--files.json
      |--Gruntfile.js
      |--README.md

2. 项目(Project)

    For example(enc-topology):
    
    |--enc-topology
      |--dest(Automatic generation)
        |--css
        |--js
        |--libs
        |--resource
      |--src
        |--js
        |--less
        |--libs
        |--resource
      |--index.html
      |--index_mockup.html
      |--index_debug.html
      |--.gitignore
      |--files.json
      |--Gruntfile.js
      |--README.md
      
# 文件名
1. 类文件：只定义一个类的文件必须必须与类名一致，每个单词首字母大写。如：`MyClass.js`
2. 配置文件：

        1). 专门用于配置App的可配置信息，文件名全小写。如：`config.js`
        2). 如只是静态数据信息，最好直接配置成原生Json或者Array对象，为了提升性能，减少创建Class性能和消耗，除非有对某个属性有明确的get, set区别, 可以使用静态类。
        
3. 数据文件：App中提供的静态数据源，文件名全小写。如：`data.json`

# 语法
1. 所有语句单独一行，每一行单独语句结尾必须带分号。
2. if/while/for等表达式必须带花括号并且换行。
3. 定义类必须放在函数闭包里面。
4. 尽量只写一重三元表达式。

# 变量
1. 闭包变量：闭包变量采用驼峰式命名。如：`var myValue`
2. 方法参数：方法参数采用驼峰式命名。如：`function (inParameter, inArgs)`
3. 局部变量：方法内的局部变量采用下划线加驼峰式命名。如：`var _myVar`

# 方法
1. 公有方法：公有方法采用驼峰式命名。如：`myPublicMethod: function()`
2. 私有方法：私有方法采用双下划线加驼峰式命名。如：`__myPrivateMethod: function()`

# 类
1. 类元数据的顺序：mixins->static->statics自定义元数据->events->view->properties->methods
2. 框架内的属性访问器统一使用get/set
3. 属性元数据的顺序：value->get->set->自定义元数据

# 建议
1. 对于功能复杂的模块，尽量进行拆分成单元性函数，如果重复共用，可以把相关模块封装成全局通用模块。
2. 代码尽量简单明了，如果是为解决某个复杂逻辑是程序复杂度变高，希望在对应模块写清楚注释。
