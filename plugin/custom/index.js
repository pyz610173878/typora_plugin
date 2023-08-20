class CustomPlugin extends global._basePlugin {
    process = () => {
        this.dynamicUtil = {target: null};

        const {callback} = this.utils.requireFilePath("./plugin/custom/callback.js");
        this.callback = new callback();
        this.optionMap = {}
        this.config.OPTIONS.forEach(option => {
            if (option.enable && (option.name) && this.callback[option.callback] instanceof Function) {
                this.optionMap[option.name] = option;
            }
        })
    }

    dynamicCallArgsGenerator = anchorNode => {
        this.dynamicUtil.target = anchorNode;

        const dynamicCallArgs = [];
        for (const name in this.optionMap) {
            const option = this.optionMap[name];

            if (!option.selector || anchorNode.closest(option.selector)) {
                dynamicCallArgs.push({
                    arg_name: option.name,
                    arg_value: option.name,
                })
            }
        }
        return dynamicCallArgs;
    }

    call = arg_name => {
        const option = this.optionMap[arg_name];
        if (option) {
            const target = this.dynamicUtil.target.closest(option.selector);
            this.callback[option.callback](target, this.utils);
        }
    }
}

module.exports = {
    plugin: CustomPlugin
};