// ./plugin/custom/plugins/myFullPathCopy.js

// 1
class myFullPathCopy extends BaseCustomPlugin {
    // 2
    selector = () => "#write h1, h2, h3, h4, h5, h6"
    // 3
    hint = () => "将当前标题的路径复制到剪切板测试一下"
    // 4
    init = () => {}
    // 5
    style = () => {}
    // 6
    styleTemplate = () => {}
    // 7
    html = () => {}
    // 8
    hotkey = () => [this.config.hotkey]
    // 9
    beforeProcess = async () => {}
    // 10
    process = () => { console.log(123123);}
    // 11
    callback = anchorNode => {
        const paragraphList = ["H1", "H2", "H3", "H4", "H5", "H6"];
        const nameList = ["一级标题", "二级标题", "三级标题", "四级标题", "五级标题", "六级标题"];
        const pList = [];
        let ele = anchorNode;

        while (ele) {
            const idx = paragraphList.indexOf(ele.tagName);
            if (idx !== -1) {
                if (pList.length === 0 || (pList[pList.length - 1].idx > idx)) {
                    pList.push({ele, idx})
                    if (pList[pList.length - 1].idx === 0) break;
                }
            }
            ele = ele.previousElementSibling;
        }

        pList.reverse();

        let filePath = (this.config.full_file_path) ? this.utils.getFilePath() : File.getFileName();
        filePath = filePath || this.config.untitled_file_name;
        const result = [filePath];
        let headerIdx = 0;
        for (const p of pList) {
            while (headerIdx < 6 && p.ele.tagName !== paragraphList[headerIdx]) {
                if (!this.config.ignore_empty_header) {
                    const name = this.getHeaderName("无", nameList[headerIdx]);
                    result.push(name);
                }
                headerIdx++;
            }

            if (p.ele.tagName === paragraphList[headerIdx]) {
                const name = this.getHeaderName(p.ele.querySelector("span").textContent, nameList[headerIdx]);
                result.push(name);
                headerIdx++;
            }
        }

        const text = this.utils.Package.Path.join(...result);
        navigator.clipboard.writeText(text);
    }

    getHeaderName = (title, name) => {
        const space = this.config.add_space ? " " : "";
        return title + space + name
    }
}

// 12
module.exports = { plugin: myFullPathCopy };

// 1. 创建 class，继承 BaseCustomPlugin 类。之后 myFullPathCopy 将自动拥有 utils、info、config 属性。
//    - utils：插件系统自带的静态工具类，其定义在 `./plugin/global/core/plugin.js/utils`。其中有三个重要的函数：utils.getPlugin(fixedName) 和 utils.getCustomPlugin(fixedName) 用于获取已经实现的全部插件，调用其 API，具体的 API 可看 ./plugin/custom/openPlatformAPI.md 文件。utils.addEventListener(eventType, listener) 用于监听 Typora 的生命周期事件。
//    - info：该插件在 custom_plugin.user.toml 里的所有字段
//    - config：等同于 info.config，即配置文件里的 config 属性
// 2. selector：当光标位于哪些位置时，此命令才可用（空串：任何位置都可用），在这里的含义就是：只当光标位于【正文标题】时可用
// 3. hint：当鼠标移动到右键菜单时的提示
// 4. init：在这里初始化你要的变量
// 5. style：给 Typora 插入 style 标签。返回值为 string。若你想指定标签的 id，也可以返回 {textID: "", text: ""}。其中 textID 为此 style 标签的 id，text 为 style 内容。
// 6. styleTemplate: 引入 `./plugin/global/user_styles` 目录下和插件同名的 css 文件。详情请参考`user_styles/请读我.md`
// 7. html：为 Typora 插入 HTML 标签，返回 Element 类型。
// 8. hotkey：为 callabck 注册快捷键，返回 Array<string> 类型。
// 9. beforeProcess：最先执行的函数，在这里初始化插件需要的数据。若返回 this.utils.stopLoadPluginError，则停止加载插件
// 10. process：在这里添加添加插件业务逻辑，比如添加 listener 和修改 Typora 的第一方函数
// 11. callback：右键菜单中点击/键入快捷键后的回调函数。anchorNode 参数: 鼠标光标所在的 Element
// 12. export：导出名为 plugin