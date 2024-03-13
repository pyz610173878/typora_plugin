// ./plugin/custom/plugins/helloWorld.js

class helloWorld extends BaseCustomPlugin {
    hint = () => "this is hello world hint"

    hotkey = () => [this.config.hotkey_string]

    process = () => {
        console.log(this.config.console_message);
        console.log("[helloWorldPlugin]：", this);
    }

    callback = anchorNode => {
        alert(this.config.show_message);
    }
}

module.exports = { plugin: helloWorld };